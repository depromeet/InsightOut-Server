import { ServiceUnavailableException } from '@nestjs/common';
import * as AllHtmlEntites from 'html-entities';

const { decode } = AllHtmlEntites;

const indexOfAny = (string, separator, from) => {
  const founds = separator
    .split('')
    .map((s) => string.indexOf(s, from))
    .filter((s) => s > -1)
    .sort((a, b) => a - b);

  if (founds.length === 0) {
    return -1;
  }
  return founds[0];
};

export const split = (string, limit) => {
  const splitted = [];
  let found = -1;
  let lastFound = -1;
  let lastSplitted = -1;
  let wordCount = 0;

  for (;;) {
    found = indexOfAny(string, ' \n\t', lastFound + 1);
    if (found === -1) {
      break;
    }
    if (found - lastFound === 1) {
      lastFound = found;
    } else {
      wordCount += 1;
      if (wordCount >= limit) {
        splitted.push(string.substr(lastSplitted + 1, found - lastSplitted));
        wordCount = 0;
        lastSplitted = found;
      }
      lastFound = found;
    }
  }

  if (lastSplitted + 1 !== string.length) {
    splitted.push(string.substr(lastSplitted + 1));
  }

  return splitted;
};

// Parses server response.
export const parseJSON = (response: any) => {
  // console.log(response);
  try {
    return response
      .match(/\tdata = \[.*;/g)
      .map((data) => JSON.parse(data.substring(8, data.length - 1)))[0][0]
      .errInfo.map((pnutypo) => {
        let suggestions = pnutypo.candWord.replace(/\|$/, '');
        if (suggestions === '') {
          suggestions = decode(pnutypo.orgStr);
        }
        const info = pnutypo.help
          .replace(/< *[bB][rR] *\/>/g, '\n')
          .replace(/\n\n/g, '\n')
          .replace(/\n\(예\) /g, '\n(예)\n')
          .replace(/  \(예\) /g, '\n(예)\n')
          .replace(/   */g, '\n');

        return {
          token: decode(pnutypo.orgStr),
          suggestions: decode(suggestions).split('|'),
          info: decode(info),
        };
      });
  } catch (err) {
    throw new ServiceUnavailableException('맞춤법 검사에 오류가 발생했습니다.');
  }
};

export const byLength = (string, separator, limit) => {
  const splitted = [];
  let found = -1;
  let lastFound = -1;
  let lastSplitted = -1;

  for (;;) {
    found = indexOfAny(string, separator, lastFound + 1);
    if (found === -1) {
      break;
    }
    if (found - lastSplitted > limit) {
      splitted.push(string.substr(lastSplitted + 1, lastFound - lastSplitted));
      lastSplitted = lastFound;
    }
    lastFound = found;
  }

  if (lastSplitted + 1 !== string.length) {
    if (string.length - lastSplitted - 1 <= limit) {
      splitted.push(string.substr(lastSplitted + 1));
    } else {
      if (lastSplitted !== lastFound) {
        splitted.push(
          string.substr(lastSplitted + 1, lastFound - lastSplitted),
        );
      }
      splitted.push(string.substr(lastFound + 1));
    }
  }

  return splitted;
};

export const getAttr = (string, key) => {
  const found = string.indexOf(key);
  const firstQuote = string.indexOf('"', found + 1);
  const secondQuote = string.indexOf('"', firstQuote + 1);
  return string.substr(firstQuote + 1, secondQuote - firstQuote - 1);
};

export const parseJSONFromDaum = (response) => {
  const typos = [];
  let found = -1;

  for (;;) {
    found = response.indexOf('data-error-type', found + 1);
    if (found === -1) {
      break;
    }

    const end = response.indexOf('>', found + 1);
    const line = response.substr(found, end - found);
    const typo = {
      type: '',
      token: '',
      suggestions: [],
      context: '',
      info: '',
    };

    typo.type = decode(getAttr(line, 'data-error-type='));
    typo.token = decode(getAttr(line, 'data-error-input='));
    typo.suggestions = [decode(getAttr(line, 'data-error-output='))];
    typo.context = decode(getAttr(line, 'data-error-context='));

    const infoBegin = response.indexOf('<div>', found);
    let infoEnd = response.indexOf('</div>', infoBegin + 1);
    // In case, info has another <div>.
    const infoNextEnd = response.indexOf('</div>', infoEnd + 1);
    const nextFound = response.indexOf('inner_spell', infoBegin);
    if (infoNextEnd !== -1 && (nextFound === -1 || nextFound > infoNextEnd)) {
      infoEnd = infoNextEnd;
    }

    typo.info = decode(response.substr(infoBegin, infoEnd + 6 - infoBegin))
      .replace(/\t/g, '')
      .replace(/<strong class[^>]*>[^>]*>\n/gi, '')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\n\n\n\n\n/g, '\n(예)\n')
      .replace(/\n\n*$/g, '')
      .replace(/^[ \n][ \n]*/g, '');

    if (typo.info === '도움말이 없습니다.') delete typo.info;

    typos.push(typo);
  }
  return typos;
};
