import configparser
import json
import sys
import tkinter as tk
from PyQt5.QtCore import QUrl

import coins
from s_bridge import out_fnc, from_modules
import f_main
from PyQt5.QtWidgets import QApplication
from tkinter import filedialog
import crypto_find as cs
from mini import *
from xls import to_excel

config = {}
dct = {}
cur_lang = {}


# Get saved settings
def get_config():
    global config
    with open('config.json') as json_file:
        config = json.load(json_file)


# Save new settings
def save_config():
    global config
    with open('config.json', 'w') as outfile:
        json.dump(config, outfile)


# Get saved settings when project starting
def start_init():
    return
    global config
    config = configparser.ConfigParser()
    config.read('ini.ini')
    lang = config["MAIN"]["Lang"]
    print(lang)
    config["MAIN"]["Lang"] = 'ru' if lang == 'en' else 'en'
    with open('ini.ini', 'w') as configfile:
        config.write(configfile)


# This is a bridge for calling any functions of this and other modules from external modules
@from_modules
def fnc2(obj):
    if obj['type'] == 'JS':
        runJS(obj['val'])
    elif obj['type'] == 'click':
        click_in_pro(obj['val']['name'], obj['val']['val'])
    elif obj['type'] == 'pro':
        click_in_pro(obj['name'], obj['val'])


# Call Javascript function in inner browser
def runJS(pack):
    WMain.page().runJavaScript(pack)


# General function - fork for calling other functions
def click_in_pro(itm, value):
    if itm == "change_language":
        change_language(value)
    elif itm == "add_item_in_tlb":
        add_item_in_tlb(value)
    elif itm == "go_select":
        get_folder()
    elif itm == "go_search":
        cs.pro = value
        WMain.thread.start()
    elif itm == "to_excel":
        to_excel(cs.result)
    elif itm == 'test':
        pass


# Dialog for selecting a folder for searching
def fill_coins():
    list_of_coins = [coin["Name"] for coin in coins.coins]
    txt_list = ";".join(list_of_coins)
    js = "fill_coins('{}')".format(txt_list)
    runJS(js)


# Get dictionary with languages
def get_languages():
    global dct
    with open('lang.json', encoding='utf-8') as json_file:
        dct = json.load(json_file)
    runJS("get_languages('{}')".format(json.dumps(dct)))
    change_language('')
    runJS("change_language('{}')".format(config['lang']))


# Change language by clicking in browser
def change_language(lang):
    global config, cur_lang
    if lang:
        config["lang"] = lang
    else:
        if not config['lang']:
            config['lang'] = 'en'
        lang = config["lang"]
    cur_lang = dct[lang]
    save_config()


# Dialog for selecting a folder for searching
def get_folder():
    root = tk.Tk()
    root.withdraw()
    folder = filedialog.askdirectory()
    if folder != '':
        js = "document.getElementById('search_source').innerText='{}'".format(folder)
        runJS(js)


# Add info about finded hit in table with results
def add_item_in_tlb(item):
    pack = json.dumps(item, ensure_ascii=False)
    js = "add_item_in_tlb({})".format(pack)
    out_fnc({'type': "JS", 'val': js})
    runJS('change_status("found")')


# Change info about scanning process after new hit
def change_info(folder, file):
    cur_info = "Scanning process: " + folder + ". File: " + file
    js = "document.getElementById('cur_info').innerText = '" + cur_info + "'"
    runJS(js)


# Load html-page in browser
def first_load():
    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "html/main.html"))
    local_url = QUrl.fromLocalFile(file_path)
    WMain.loadFinished.connect(fill_coins)
    WMain.loadFinished.connect(get_config)
    WMain.loadFinished.connect(get_languages)
    WMain.load(QUrl(local_url))


# Starting
if __name__ == "__main__":
    app = QApplication(sys.argv)
    WMain = f_main.WB()
    WMain.showNormal()
    first_load()
    sys.exit(app.exec_())
