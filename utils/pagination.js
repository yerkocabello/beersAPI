'use strict';

var DEFAULT_OFFSET = 0;
const env = process.env.NODE_ENV || 'development';

const config = require(__dirname + '/../config/config.json')[env];

var DEFAULT_PAGE_SIZE = parseInt(config.pagination.general);

exports.DEFAULT_PAGE_SIZE = DEFAULT_PAGE_SIZE;

export function paginate(page_number, total_entries, page_size = DEFAULT_PAGE_SIZE){

    page_number = page_number || 1; //Default value
    page_number = page_number > 0 ? page_number : 1; //Negative numbers will be shifted to first page
    page_number = parseInt(page_number); //Cast to integer
    page_size = parseInt(page_size); //Cast to integer
    total_entries = total_entries || 0;
    var result = {};
    //Calculate offset
    result.offset = (page_number - 1) * page_size;
    result.limit = page_size;
    result.total_pages = Math.ceil(total_entries / page_size);
    result.current_page = page_number;
    result.next_page = page_number == result.total_pages ? 0 : page_number + 1;
    result.previous_page = page_number == 1 ? 0 : page_number - 1;
    result.total_items = total_entries;

    return result
}
