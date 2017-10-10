import Ember from 'ember';
import { isNumeric } from './math';
import { formatTime as formatMilliseconds } from 'gooru-web/utils/utils';
import { aggregateCollectionPerformanceSummaryItems } from 'gooru-web/utils/performance-summary';
import {
  DEFAULT_IMAGES,
  EMOTION_VALUES,
  GRADING_SCALE
} from 'gooru-web/config/config';
/**
 * Function for sorting strings alphabetically in ascending order
 * @param {string} a
 * @param {string} b
 * @returns {number} - -1 if 'a' should go before 'b'; 1 if 'b' should go before 'a'; or else, 0.
 */
export function alphabeticalStringSort(a, b) {
  const lowerCaseA = a.toLowerCase();
  const lowerCaseB = b.toLowerCase();

  return lowerCaseA < lowerCaseB ? -1 : lowerCaseA > lowerCaseB ? 1 : 0;
}

/**
 * Check the standards that are checkable against the codes (provided by user)
 * and disable those who are not in codes arrays.
 * @param standards
 * @param checkableStandards
 * @param codes
 */
export function checkStandards(standards, checkableStandards, codes) {
  standards.forEach(function(standard) {
    if (checkableStandards.includes(standard.get('id'))) {
      standard.set('disabled', !codes.includes(standard.get('id')));
    }
  });
}

/**
 * Formats the Unit, Lesson, Assessment and Collection label
 * @param {number} index
 * @param {string} type
 * @param {service} i18n
 */
export function courseSectionsPrefix(index, type, i18n, longName) {
  index += 1;
  var prefixIndex = index;
  var letter;
  var sectionPrefix;
  if (longName) {
    const i18nKey = `common.${type}`;
    letter = i18n.t(i18nKey);
    sectionPrefix = `${letter} ${prefixIndex}`;
  } else {
    const i18nKey = `common.${type}Initial`;
    letter = i18n.t(i18nKey);
    sectionPrefix = `${letter}${prefixIndex}`;
  }

  return sectionPrefix;
}

/**
 * Formats a date into a string
 * @param {Date} date
 * @param {string} format
 */
export function formatDate(date, format) {
  format = format || 'dddd, MMMM Do, YYYY h:mm A';
  return moment(date).format(format);
}

/**
 * Formats a date into a string
 * @param {string} strDate
 * @param {string} format
 * @return {Date}
 */
export function parseDate(strDate, format) {
  format = format || 'dddd, MMMM Do, YYYY h:mm A';
  return moment(strDate, format).toDate();
}

/**
 * Format a certain number of milliseconds to a string of the form
 * '<hours>h <min>m or <min>m <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInMillis - time value in milliseconds
 * @returns {String}
 */
export function formatTime(timeInMillis) {
  var result = '';
  var secs;

  if (timeInMillis) {
    secs = timeInMillis / 1000;
    const hours = secs / 3600;
    secs = secs % 3600;
    const mins = secs / 60;
    secs = secs % 60;

    if (hours >= 1) {
      result = `${Math.floor(hours)}h `;
      if (mins >= 1) {
        result += `${Math.floor(mins)}m`;
      }
    } else {
      if (mins >= 1) {
        result = `${Math.floor(mins)}m `;
      }
      if (secs >= 1) {
        result += `${Math.floor(secs)}s`;
      }
    }
  } else {
    result = '';
  }

  return result;
}

/**
 * Format a certain number of seconds to a string of the form
 * '<hours>h <min>m or <min>m <sec>s'. If the value is falsey, a string
 * with the value '--' is returned
 * @param timeInSeconds - time value in seconds
 * @returns {String}
 */
export function formatTimeInSeconds(timeInSeconds) {
  return formatTime(timeInSeconds * 1000);
}

/**
 * Get an icon depending on whether an answer was correct or not.
 * @param {boolean} isCorrect - was the answer correct or not?
 * @returns {String} - html string
 */
export function getAnswerResultIcon(isCorrect) {
  var html;

  if (isCorrect) {
    html =
      '<span class="score answer-correct"><i class="gru-icon material-icons">done</i></span>';
  } else if (isCorrect === false) {
    html =
      '<span class="score answer-incorrect"><i class="gru-icon material-icons">clear</i></span>';
  } else {
    // Null or any other falsy value
    html = '<span class="score answer-undefined"></span>';
  }
  return html;
}

/**
 * Find the color corresponding to the grade bracket that a specific grade belongs to
 * @see gooru-web/config/config#GRADING_SCALE
 * @param grade
 * @returns {String} - Hex color value
 */
export function getGradeColor(grade) {
  var bracket = GRADING_SCALE.length - 1;
  var color = '#949A9F'; // Default color - $dark-100

  if (isNumeric(grade)) {
    for (; bracket >= 0; bracket--) {
      if (grade >= GRADING_SCALE[bracket].LOWER_LIMIT) {
        color = GRADING_SCALE[bracket].COLOR;
        break;
      }
    }
  }
  return color;
}

/**
 * Get a html of the score string.
 * @param {number} value - %value
 * @returns {String} - html string
 */
export function getScoreString(value) {
  if (typeof value === 'number') {
    var gradeColor = getGradeColor(value);
    return `<span class="score" style="background-color: ${gradeColor}">${value} %</span>`;
  }

  return '<span class="score answer-undefined"></span>';
}

/**
 * Get an icon depending on a reaction value. If the reaction value is null,
 * a dash is returned. For any other falsy value, an empty string is returned.
 * @param {Number} reactionValue
 * @returns {String} - html string
 */
export function getReactionIcon(reactionValue, basePath = '') {
  var html;

  if (reactionValue) {
    var reaction = EMOTION_VALUES.filter(function(emotion) {
      return emotion.value === reactionValue;
    })[0];
    if (reaction && reaction.value && reaction.unicode) {
      html = `<div class="emotion emotion-${reaction.value}">`;
      html += '  <svg class="svg-sprite">';
      html += `    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="${basePath}assets/emoji-one/emoji.svg#${reaction.unicode}"></use>`;
      html += ' </svg>';
      html += '</div>';
    } else {
      html = '<div class="align-center">&mdash;</div>';
    }
  } else if (reactionValue === null) {
    html = '<div class="align-center">&mdash;</div>';
  } else {
    html = '';
  }
  return html;
}

/**
 * Convert a number into Upper Letter
 * @param number
 * @returns {string}
 */
export function getLetter(number) {
  return String.fromCharCode(65 + number);
}

/**
 * Function for sorting numbers in ascending order
 * @param {number} a
 * @param {number} b
 * @returns {number} - -1 if 'a' should go before 'b'; 1 if 'b' should go before 'a'; or else, 0.
 */
export function numberSort(a, b) {
  a = a ? a : !!a;
  b = b ? b : !!b;
  return a - b;
}

/**
 * Generates Uuid's
 */
export function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
    c
  ) {
    var r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

/**
 * Truncates a text
 * @param {string} text
 * @param {number} maxLength max allowed length for text, optional
 * @param {string} type indicates the truncate type, optional
 * @param {boolean} suffix indicates if it adds or not a suffix, default is true
 * @returns {*}
 */
export function truncate(text, maxLength, type, suffix) {
  let config = {
    //TODO product owner will provide max lengths, this will be moved to the configuration
    name: 15,
    short: 10,
    'player-nav-sm': 30,
    medium: 35,
    'collection-card-courses': 45,
    'medium-large': 100,
    large: 200
  };
  let defaultType = 'short';

  if (!text) {
    return null;
  }

  if (!maxLength && !type) {
    //default behavior
    type = defaultType;
  }

  if (type) {
    maxLength = config[type] || config[defaultType];
  }

  let addSuffix = suffix !== false;

  let truncated = text;
  if (text.length > maxLength) {
    truncated = text.substring(0, maxLength);
    if (addSuffix) {
      truncated = `${truncated}...`;
    }
  }

  return truncated;
}

/**
 * Remove html tags from text
 * @param {String} text
 * @returs {String}
 */
export function noTags(text) {
  let element = document.createElement('p');
  element.innerHTML = text;
  return $(element).text();
}

/**
 * Returns a date in utc
 * @param {Date} date
 * @returs {Moment} utc moment
 */
export function toUtc(date) {
  return date ? moment(date).utc() : date;
}

/**
 * Returns a date in timestamp
 * @param {Date} date
 * @returs {number} timestamp
 */
export function toTimestamp(date) {
  return date ? date.getTime() : date;
}

/**
 * Returns a date in timestamp
 * @param {moment} moment
 * @returs {number} timestamp
 */
export function momentToTimestamp(moment) {
  return moment ? moment.valueOf() : moment;
}

/**
 * Returns a date in local time
 * @param {number} timestamp
 */
export function toLocal(timestamp) {
  return moment.utc(timestamp).toDate();
}
/**
 * Replace / to _
 *
 */
export function normalizeQuestionTypes(questionType) {
  return questionType.replace('/', '_');
}

/**
 * check if is a config default image
 * @param {string []} config default images
 * @param {string} url of file
 */
function isDefaultImage(defaultImages, url) {
  var isDefaultImage = false;

  defaultImages.forEach(function(image) {
    if (url.indexOf(image) >= 0) {
      isDefaultImage = true;
    }
  });

  return isDefaultImage;
}

/**
 * Returns filename from url
 * @param {String} file complete url
 */
export function cleanFilename(url, cdnUrls) {
  if (url) {
    var defaultImages = Ember.$.map(DEFAULT_IMAGES, value => value);
    if (cdnUrls) {
      url = url.replace(cdnUrls.content, '');
      url = url.replace(cdnUrls.user, '');
    }
  }

  return url && !isDefaultImage(defaultImages, url)
    ? /([^/]*\/\/[^/]+\/)?(.+)/.exec(url)[2]
    : '';
}

/**
 * This function is used to clear up fields when serializing then. At the
 * BE a null field will delete the value at the repository a non present field (undefined) would be ignored (not changed).
 *
 * Returns null if value is empty or null
 * Returns undefined if value is undefined
 * Otherwise it returns value
 * @param {string} value
 */
export function nullIfEmpty(value) {
  let toReturn = value;
  if (value !== undefined) {
    toReturn = value && value.length ? value : null;
  }
  return toReturn;
}

/**
 * Returns filename with extension from a invalid url
 * @param {String} file complete url
 */
export function getFileNameFromInvalidUrl(url) {
  const regex = /\w+(?:\.\w+)*$/;
  const validURL = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  var match;
  if (validURL.exec(url)) {
    match = url;
  } else {
    match = regex.exec(url);
  }

  return match;
}
/**
 * Replace math expression before save
 */
export function replaceMathExpression(text) {
  var questionText = $.parseHTML(text);
  var newQuestionText = '';
  $.each(questionText, function(i, el) {
    let latex = $(el)
      .find('.source')
      .text();
    if (latex.length > 0) {
      let mathToSave = `<span class='gru-math-expression'><span class='source' hidden>${latex}</span>$$${latex}$$</span>`;
      $(el)
        .empty()
        .append(mathToSave);
    }
    if (el.outerHTML) {
      newQuestionText = newQuestionText.concat(el.outerHTML);
    } else {
      newQuestionText = newQuestionText.concat(el.textContent);
    }
  });

  return newQuestionText;
}

/**
 * Remove html tags to validate blanks
 */
export function removeHtmlTags(text) {
  var newText;

  if (text) {
    newText = text.replace(/(<([^>]+)>)/gi, '');
  }

  return newText;
}

/**
 * Returns resource name with a protocol if it is necessary
 * @param {String} url
 * @param {boolean} addSecureProtocol
 */
export function addProtocolIfNecessary(url, addSecureProtocol) {
  const pattern = /^((http|https|ftp):\/\/)/;
  var protocol = 'http:';

  if (!pattern.test(url)) {
    //if no protocol add http/https
    if (addSecureProtocol) {
      protocol = 'https:';
    }
    return protocol + url;
  }

  return url;
}

/**
 * Check if it is a GoogleDoc
 * @param {String} asset url
 * @returns {boolean}
 */
export function checkIfIsGoogleDoc(assetUrl) {
  return (
    assetUrl.indexOf('//drive.google') !== -1 ||
    assetUrl.indexOf('//docs.google') !== -1
  );
}

/**
 * Check if the session cdn url is in the resource url
 * @param {String} resource url
 * @param {String} cdn url
 * @returns {boolean}
 */
export function checkDomains(resourceUrl, cdnUrl) {
  return resourceUrl.indexOf(cdnUrl) !== -1;
}
/**
 * Prepares student csv file data to download
 * @param {string []} assessments the metrics table headers
 * @param {string []} collectionPerformanceSummaryItems the metrics table performance data
 * @param {string []} headers (assessments/collections)
 *  @param {string} contentTitle
 */
export function prepareStudentFileDataToDownload(
  assessments,
  collectionPerformanceSummaryItems,
  headers,
  contentTitle
) {
  var dataHeaders = headers;
  const dataArray = Ember.A([]);

  assessments.sort(function(a, b) {
    return alphabeticalStringSort(a.title, b.title) * 1;
  });

  let summary = aggregateCollectionPerformanceSummaryItems(
    collectionPerformanceSummaryItems || Ember.A([])
  );

  var summaryItems = Ember.A([
    contentTitle,
    summary.get('score'),
    `${collectionPerformanceSummaryItems.length} / ${assessments.length} `,
    formatMilliseconds(summary.get('timeSpent'))
  ]);

  dataArray.push(summaryItems);

  assessments.forEach(function(assessment) {
    var collectionPerformanceSummaryItem = collectionPerformanceSummaryItems.findBy(
      'id',
      assessment.get('id')
    );
    var itemDataArray = Ember.A([
      assessment.get('title'),
      collectionPerformanceSummaryItem.get('score'),
      collectionPerformanceSummaryItem.get('status'),
      formatMilliseconds(collectionPerformanceSummaryItem.get('timeSpent'))
    ]);
    dataArray.push(itemDataArray);
  });

  return {
    fields: dataHeaders,
    data: dataArray
  };
}

/**
 * prepares collection file data
 * @param {string []} performanceDataHeaders the metrics table headers
 * @param {string []} performanceDataMatrix the metrics table performance data
 */
function collectionFileData(
  performanceDataHeaders,
  performanceDataMatrix,
  level
) {
  const performanceAverageHeaders = performanceDataMatrix.objectAt(0)
    .performanceData;
  const performanceData = performanceDataMatrix.slice(1);
  var dataHeaders = Ember.A(['Student', 'Average time']);
  var dataMatrix = Ember.A([]);
  var averageHeaders = Ember.A(['Class average']);

  let sortedData = performanceData;

  //alphabeticalStringSort
  sortedData.sort(function(a, b) {
    return alphabeticalStringSort(a.user, b.user) * 1;
  });

  performanceDataHeaders.forEach(function(headerItem, index) {
    const prefixHeader =
      level === 'course' ? `U${index + 1} ` : `L${index + 1} `;
    const timeHeader = `${prefixHeader}${headerItem.get('title')} time`;
    dataHeaders.push(timeHeader);
  });

  performanceAverageHeaders.forEach(function(avHeaderItem) {
    const time = avHeaderItem.get('timeSpent');
    averageHeaders.push(time);
  });

  dataMatrix.push(averageHeaders);

  sortedData.forEach(function(dataItem) {
    var data = Ember.A([]);
    const performanceDataContent = dataItem.performanceData;
    const student = dataItem.get('user');
    data.push(student);
    performanceDataContent.forEach(function(dataContentItem) {
      if (dataContentItem) {
        const time = `${dataContentItem.get('timeSpent')}`;
        data.push(time);
      } else {
        //this is to fill the table with blanks when there isn't dataContentItem
        data.push('');
      }
    });
    dataMatrix.push(data);
  });

  return {
    fields: dataHeaders,
    data: dataMatrix
  };
}

/**
 * prepares assessment file data
 * @param {string []} performanceDataHeaders the metrics table headers
 * @param {string []} performanceDataMatrix the metrics table performance data
 */
function assessmentFileData(
  performanceDataHeaders,
  performanceDataMatrix,
  level
) {
  const performanceAverageHeaders = performanceDataMatrix.objectAt(0)
    .performanceData;
  const performanceData = performanceDataMatrix.slice(1);
  var dataHeaders = Ember.A(['Student', 'Average score', 'Average time']);
  var dataMatrix = Ember.A([]);
  var averageHeaders = Ember.A(['Class average']);

  let sortedData = performanceData;

  //alphabeticalStringSort
  sortedData.sort(function(a, b) {
    return alphabeticalStringSort(a.user, b.user) * 1;
  });

  performanceDataHeaders.forEach(function(headerItem, index) {
    const prefixHeader =
      level === 'course'
        ? `U${index + 1} `
        : level === 'unit' ? `L${index + 1} ` : `A${index + 1} `;
    const scoreHeader = `${prefixHeader}${headerItem.get('title')} score`;
    const timeHeader = `${prefixHeader}${headerItem.get('title')} time`;
    dataHeaders.push(scoreHeader);
    dataHeaders.push(timeHeader);
  });
  performanceAverageHeaders.forEach(function(avHeaderItem) {
    const score = avHeaderItem.hideScore
      ? 'N/A'
      : avHeaderItem.hasScore && avHeaderItem.hasStarted
        ? `${avHeaderItem.score}%`
        : '--%';
    const time = `${avHeaderItem.get('timeSpent')}`;
    averageHeaders.push(score);
    averageHeaders.push(time);
  });
  dataMatrix.push(averageHeaders);

  sortedData.forEach(function(dataItem) {
    var data = Ember.A([]);
    const performanceDataContent = dataItem.performanceData;
    const student = dataItem.get('user');
    data.push(student);
    performanceDataContent.forEach(function(dataContentItem) {
      if (dataContentItem) {
        const score = dataContentItem.hideScore
          ? 'N/A'
          : dataContentItem.hasScore && dataContentItem.hasStarted
            ? `${dataContentItem.score}%`
            : '--%';
        const time = `${dataContentItem.get('timeSpent')}`;
        data.push(score);
        data.push(time);
      } else {
        //this is to fill the table with blanks when there isn't dataContentItem
        data.push('');
        data.push('');
      }
    });
    dataMatrix.push(data);
  });

  return {
    fields: dataHeaders,
    data: dataMatrix
  };
}

/**
 * prepares lesson collection file data
 * @param {string []} performanceDataHeaders the metrics table headers
 * @param {string []} performanceDataMatrix the metrics table performance data
 */
function lessonCollectionFileData(
  performanceDataHeaders,
  performanceDataMatrix
) {
  const performanceAverageHeaders = performanceDataMatrix.objectAt(0)
    .performanceData;
  const performanceData = performanceDataMatrix.slice(1);
  var dataHeaders = Ember.A(['Student', 'Average score', 'Average time']);
  var dataMatrix = Ember.A([]);
  var averageHeaders = Ember.A(['Class average']);

  let sortedData = performanceData;

  //alphabeticalStringSort
  sortedData.sort(function(a, b) {
    return alphabeticalStringSort(a.user, b.user) * 1;
  });

  performanceDataHeaders.forEach(function(headerItem, index) {
    const prefixHeader = `C${index + 1} `;
    const timeHeader = `${prefixHeader}${headerItem.get('title')} time`;
    const scoreHeader = `${prefixHeader}${headerItem.get('title')} score`;
    dataHeaders.push(scoreHeader);
    dataHeaders.push(timeHeader);
  });
  performanceAverageHeaders.forEach(function(avHeaderItem) {
    const score = avHeaderItem.hideScore
      ? 'N/A'
      : avHeaderItem.hasScore && avHeaderItem.hasStarted
        ? `${avHeaderItem.score}%`
        : '--%';
    const time = `${avHeaderItem.get('timeSpent')}`;
    averageHeaders.push(score);
    averageHeaders.push(time);
  });
  dataMatrix.push(averageHeaders);

  sortedData.forEach(function(dataItem) {
    var data = Ember.A([]);
    const performanceDataContent = dataItem.performanceData;
    const student = dataItem.get('user');
    data.push(student);
    performanceDataContent.forEach(function(dataContentItem) {
      if (dataContentItem) {
        const score = dataContentItem.hideScore
          ? 'N/A'
          : dataContentItem.hasScore && dataContentItem.hasStarted
            ? `${dataContentItem.score}%`
            : '--%';
        const time = `${dataContentItem.get('timeSpent')}`;
        data.push(score);
        data.push(time);
      } else {
        //this is to fill the table with blanks when there isn't dataContentItem
        data.push('');
        data.push('');
      }
    });
    dataMatrix.push(data);
  });

  return {
    fields: dataHeaders,
    data: dataMatrix
  };
}

/**
 * prepares csv file data to download
 * @param {string []} performanceDataHeaders the metrics table headers
 * @param {string []} performanceDataMatrix the metrics table performance data
 * @param {string} filterBy (assessments/collections)
 * @param {boolean} lessonLevel indicates if it is in the lesson level
 */
export function prepareFileDataToDownload(
  performanceDataHeaders,
  performanceDataMatrix,
  filterBy,
  level
) {
  if (filterBy === 'collection') {
    if (level === 'lesson') {
      return lessonCollectionFileData(
        performanceDataHeaders,
        performanceDataMatrix
      );
    } else {
      return collectionFileData(
        performanceDataHeaders,
        performanceDataMatrix,
        level
      );
    }
  } else {
    return assessmentFileData(
      performanceDataHeaders,
      performanceDataMatrix,
      level
    );
  }
}

/**
 * Removes blanks and transforms to lower case the file name
 * @param {String} fileName
 */
export function createFileNameToDownload(fileName) {
  var newName;

  if (fileName) {
    newName = fileName.toLowerCase().replace(/ /g, '');
  }

  return newName;
}

/**
 * Returns true if url belongs to youtube or vimeo
 * @param {String} url
 */
export function isVideoURL(url) {
  var vimeoYoutubeRegularExpression = /^(https?:\/\/)?(www\.)?(?:(vimeo)\.com\/|(youtube)\.com\/|(youtu)\.be\/)/;
  var match = vimeoYoutubeRegularExpression.test(url);
  return match;
}

/**
 * Gets and array and returns an array containing arrays of the specified size
 * @param {Array} array The aray do be divided
 * @param {Number} chunkSize the size of the chunks
 */
export function arrayChunks(array, chunkSize) {
  let chunks = Ember.A([]);
  let i = 0;
  while (i < array.length) {
    chunks.push(array.slice(i, (i += chunkSize)));
  }
  return chunks;
}

/**
 * Determine the upload type object (@see gooru-web/config/config#UPLOAD_TYPES) based on a file name extension.
 * @param {String} filename -Complete file name (including the extension)
 * @param {Object[]} uploadTypes
 * @return {Object}
 */
export function inferUploadType(filename, uploadTypes) {
  var extension = filename.substr(filename.lastIndexOf('.'));
  var selectedType = null;

  for (let i = uploadTypes.length - 1; i >= 0; i--) {
    let type = uploadTypes[i];
    if (type.validExtensions.indexOf(extension) >= 0) {
      selectedType = type;
      break;
    }
  }
  return selectedType;
}

/**
 * Check both without [] and empty []
 * @param {String} text - Text to validate for square brackets
 * @return {Boolean}
 */
export function validateSquareBracket(text) {
  return !/\[\]/g.test(text) && /(\[[^\]]+\])/g.test(text);
}
