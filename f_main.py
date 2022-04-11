import json
import time
from PyQt5.QtWidgets import QWidget
from PyQt5.QtCore import QSettings, pyqtSignal, QThread, QObject
from PyQt5.QtWebEngineWidgets import QWebEngineView, QWebEnginePage
from PyQt5 import QtWebChannel, QtCore, QtGui

from s_bridge import out_fnc
from crypto_find import examine_all

setsJS = {}


# Send in separate thread scanning process
class Worker(QObject):
    runJS = QtCore.pyqtSignal(str)

    def examine_process(self):
        examine_all()
        self.thread().quit()


# Ini PyQt-thread class for prevent freezing form when scanning process running
class Thread(QThread):
    _signal = pyqtSignal(int)

    def __init__(self):
        super(Thread, self).__init__()

    def __del__(self):
        self.wait()

    def run(self):
        for i in range(100):
            time.sleep(0.1)
            self._signal.emit(i)


# Ini backed class for connecting Javascript and Python
class Backend(QtCore.QObject):
    valueChanged = QtCore.pyqtSignal(str)

    def __init__(self, parent=None):
        super().__init__(parent)
        self._value = ""

    @QtCore.pyqtProperty(str)
    def value(self):
        return self._value

    @value.setter
    def value(self, v):
        self._value = v
        self.valueChanged.emit(v)


class WB(QWebEngineView):
    def __init__(self):
        super(WB, self).__init__()
        self.settings = QSettings("MyCompany", "MyApp")
        geom = self.settings.value("geometry", "")
        global setsJS
        setsJS = self.settings.value("setsJS", "")
        if geom != '':
            self.restoreGeometry(geom)
        backend = Backend(self)
        backend.valueChanged.connect(self.fromJS)
        self.setWindowIcon(QtGui.QIcon('img/crypto-logo.ico'))
        self.setWindowTitle('CryptoScan')
#        self.showNormal()
        self.channel = QtWebChannel.QWebChannel()
        self.channel.registerObject("backend", backend)
        self.setPage(WebEnginePage(self))
        self.page().setWebChannel(self.channel)
        self.thread = QtCore.QThread()  # create thread
        self.exe = Worker()  # create object for execute code in outher thread
        self.exe.moveToThread(self.thread)  # transfer object in outher thread
        self.exe.runJS.connect(self.toJS)  # get signals and slots
        self.thread.started.connect(
        self.exe.examine_process)  # add start-thread signal to tun method from object in outher thread



    @QtCore.pyqtSlot(str) # Sending commands in Javascript from Python
    def toJS(self, js):
        self.page().runJavaScript(js)


    @QtCore.pyqtSlot(str) #Reseving commands from Javascript
    def fromJS(self, pack):
        obj = json.loads(pack)
        out_fnc({'type': "click", 'val': obj})


class WebEnginePage(QWebEnginePage):
    def javaScriptConsoleMessage(self, level, message, lineNumber, sourceID):
        print("javaScriptConsoleMessage: ", level, message, lineNumber, sourceID)
