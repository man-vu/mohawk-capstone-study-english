/**
 * Function truncates large texts
 * @param {*} str 
 * @param {*} n 
 */
function truncate(str, n) {
  return str.length > n ? str.substr(0, n - 1) + "..." : str;
}

/**
 * Function that calculates time since 
 * @param {*} date 
 */
function timeSince(date) {
  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }

  return Math.floor(seconds) + " seconds";
}

/**
 * Function that converts a date to a readable format
 * @param {*} date 
 */
function convertISOToReadableFormat(date) {
  const dateTimeFormat = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  return dateTimeFormat.format(date)
}

const characters = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "J",
  9: "K",
  10: "L",
};

/**
 * Function that paginates an array
 * @param {*} items 
 * @param {*} currentPage 
 * @param {*} itemsPerPage 
 */
function paginator(items, currentPage, itemsPerPage) {
	const page = currentPage || 1
	const per_page = itemsPerPage || 10
	const offset = (page - 1) * per_page

	const paginatedItems = items.slice(offset).slice(0, itemsPerPage)
	const totalPages = Math.ceil(items.length / per_page);

	return {
		page: page,
		per_page: per_page,
		pre_page: page - 1 ? page - 1 : null,
		next_page: (totalPages > page) ? page + 1 : null,
		total: items.length,
		total_pages: totalPages,
		data: paginatedItems
	};
}

/**
 * Function that gets avatar url
 * @param {*} url 
 */
function avatar(url) {
  return `https://learningenglishapp-assets.s3-us-west-1.amazonaws.com/avatars/${url}`
}

module.exports = {
  characters,
  truncate,
  timeSince,
  convertISOToReadableFormat,
  paginator,
  avatar
};

