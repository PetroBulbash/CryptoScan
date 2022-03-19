# Module for export search result in Excel
import inspect
import os
from typing import Optional
from xlsxwriter.worksheet import Worksheet, cell_number_tuple, cell_string_tuple
import xlsxwriter


# Export in Excel file
def to_excel(result):
    xlsx_path = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe()))) + "\\xls\\output.xlsx"
    workbook = xlsxwriter.Workbook(xlsx_path)
    worksheet = workbook.add_worksheet()
    keys = list(result[0].keys())
    for col, key in enumerate(keys):
        worksheet.write(0, col, key)
    for row, item in enumerate(result):
        for col, key in enumerate(keys):
            worksheet.write(row + 1, col, item[key])
    border_fmt = workbook.add_format({'bottom': 1, 'top': 1, 'left': 1, 'right': 1})
    worksheet.conditional_format(xlsxwriter.utility.xl_range(0, 0, len(result), len(keys)-1),
                                 {'type': 'no_errors', 'format': border_fmt})
    title_fmt = {'align': 'center', 'valign': 'vcenter', 'text_wrap': True}
    top_fmt = workbook.add_format(title_fmt)
    top_fmt.set_bold()
    worksheet.conditional_format(xlsxwriter.utility.xl_range(0, 0, 0, len(keys)-1),
                                 {'type': 'no_errors', 'format': top_fmt})
    for i in range(len(keys)):
        set_column_autowidth(worksheet, i)
    worksheet.autofilter(0, 1, 0, len(keys) - 1)
    worksheet.freeze_panes(1, 0)
    workbook.close()
    os.startfile(xlsx_path)


# Get max width of columns content for autofit width by content
def get_column_width(worksheet: Worksheet, column: int) -> Optional[int]:
    strings = getattr(worksheet, '_ts_all_strings', None)
    if strings is None:
        strings = worksheet._ts_all_strings = sorted(
            worksheet.str_table.string_table,
            key=worksheet.str_table.string_table.__getitem__)
    lengths = set()
    for row_id, colums_dict in worksheet.table.items():  # type: int, dict
        data = colums_dict.get(column)
        if not data:
            continue
        if type(data) is cell_string_tuple:
            iter_length = len(strings[data.string])
            if not iter_length:
                continue
            lengths.add(iter_length)
            continue
        if type(data) is cell_number_tuple:
            iter_length = len(str(data.number))
            if not iter_length:
                continue
            lengths.add(iter_length)
    if not lengths:
        return None
    return max(lengths)


# Autowidth setten column
def set_column_autowidth(worksheet: Worksheet, column: int):
    maxwidth = get_column_width(worksheet=worksheet, column=column)
    if maxwidth is None:
        return
    worksheet.set_column(first_col=column, last_col=column, width=maxwidth)

