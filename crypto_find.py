"""
Chris COHEN https://gist.github.com/chriswcohen/7e28c95ba7354a986c34
Rafal W. kenorb https://github.com/kenorb/dotfiles

"""

import copy
import re
import sys
import os
import json
import coinaddrvalidator
import coins
from s_bridge import out_fnc
from mmap import ACCESS_READ, mmap
from mini import pack_formats, convert_pack_file, convert_excel_file, convert_docx_file, check_base58check, \
    file_analitic

shortest_length = 25

pro = {}  # Global object of current project settings

result = []  # List of founded results

unicode_type = ['nonunicode', 'unicode']


# Performs actions on the found BTC addresses (Author: Chris COHEN)
def process_grep_match(match, byte_length):
    try:
        cur_result = check_base58check(match, byte_length)
    except OverflowError as e:
        return False
    except ValueError as e:
        return False
    except TypeError as e:
        return False
    except ValueError as e:
        return False
    return cur_result


# Main function off examine selected folder with subfolders with all internal files
def examine_all():
    global result
    if pro['is_first_start']:
        result = []
    out_fnc({'type': "JS", 'val': "change_status('run')"})
    for subdir, dirs, files in os.walk(pro["path"]):
        pro["folders_examined"] += 1
        for file in files:
            pro["files_examined"] += 1
            pro["cur_file"] = file
            pro["cur_folder"] = subdir
            path_to_file = os.path.join(subdir, file)
            pro["total_files_size"] += os.path.getsize(path_to_file)
            change_info()
            to_examine(path_to_file)
    out_fnc({'type': "JS", 'val': "change_status('end')"})


# Pass info about current process in HTML-page
def change_info():
    pack = {
        "cur_file_name": pro["cur_file"] if pro["cur_file"].isprintable else "<->",
        "cur_folder_name": pro["cur_folder"] if pro["cur_folder"].isprintable else "<->",
        "folders_examined": pro["folders_examined"],
        "files_examined": pro["files_examined"],
        "count_hits": pro["count_hits"]
    }
    js = "change_info({})".format(json.dumps(pack))
    out_fnc({'type': "JS", 'val': js})

    return
    cur_file_name = pro["cur_file"] if pro["cur_file"].isprintable else "<filename contains unprintable characters>"
    cur_folder_name = pro["cur_folder"] if pro["cur_folder"].isprintable else "<foldername contains unprintable characters>"
    info_main = "Scanning process: Number folder: {}.  Number file: {}. Number of founded: {}" \
        .format(str(pro["folders_examined"]), str(pro["files_examined"]), str(pro["count_hits"]))
    info_current = "Current folder: {}. Current file: {}." \
        .format(cur_file_name, cur_folder_name)
    js = "document.getElementById('process_info_main').innerText = '{}'".format(info_main)
    out_fnc({'type': "JS", 'val': js})
    js = "document.getElementById('process_info_current').innerText = '{}'".format(info_current)
    out_fnc({'type': "JS", 'val': js})


# Prepare (for pack and excel files) and run examine process
def to_examine(file):
    list_of_files = []                      # list for complex files: packs and excel (sheets)
    file_info = file_analitic(file)
    list_of_files.append(file_info)
    while len(list_of_files) > 0:
        cur_file = copy.copy(list_of_files[len(list_of_files) - 1])
        del list_of_files[len(list_of_files) - 1]
        if cur_file["ext"] in pack_formats:
            if pro["mode_pack"]:
                list_of_files = convert_pack_file(cur_file, list_of_files)
        elif cur_file["ext"] in (".xlsx", ".xls"):
            if pro["mode_excel"]:
                list_of_files = convert_excel_file(cur_file, list_of_files)
        elif cur_file["ext"] == ".docx":
            if pro["mode_docx"]:
                list_of_files = convert_docx_file(cur_file, list_of_files)

        else:
            examine_file(cur_file)


# Immediately scanning file
def examine_file(ffile):

    file_to_examine = ffile["cur_path"]

    try:
        
        with open(file_to_examine, 'rb') as f, mmap(f.fileno(), 0, access=ACCESS_READ) as mm:

            for g in pro['coins']:  # iterate all cryptocurrencies
                gr = coins.coins[g]
                for i in range(0, len(gr['Patterns'])):   # Second regex pattern is unicode, first - not

                    if (not pro["mode_unicode"] and i == 1) or (not pro["mode_nonunicode"] and i == 0):
                        continue
                    for match in re.finditer(gr['Patterns'][i], mm):
                        s = match.start()
                        e = match.end()
                        grep_match_found = mm[s:e].decode("utf-8")

                        # if unicode remove every other byte
                        if i == 1:
                            grep_match_found = grep_match_found[::2]

                        if gr['Byte_length'] > 0:
                            if not process_grep_match(grep_match_found, gr['Byte_length']):
                                continue

                        if gr['Validating']:
                            valid = coinaddrvalidator.validate(gr['ticker'], grep_match_found)
                            if not valid.valid:
                                continue

                        # GREP match has passed the Base58Check
                        cur_result = {"hit": grep_match_found, "file": ffile["path"], "in_pack": ffile["in_pack"],
                                      "sh": ffile["sh"], "offset": s, "type": gr['Name'], "unicode": unicode_type[i],
                                      "is_true": gr['Validating'], "test": None}
                        result.append(cur_result)
                        out_fnc({'type': "pro", 'name': "add_item_in_tlb", 'val': cur_result})
                        pro["count_hits"] += 1
                        change_info()

        f.close()
        mm.close()
    except ValueError as e:
        sys.stdout.write("ValueError: %s" % str(e))
    except PermissionError as e:
        sys.stdout.write("PermissionError: %s" % str(e))

