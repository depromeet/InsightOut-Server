import { ServiceUnavailableException } from '@nestjs/common';
import * as AllHtmlEntites from 'html-entities';

const { decode } = AllHtmlEntites;

/**
 * 문장과 구분자, 시작 인덱스를 받아서 해당 시작 인덱스로부터 문장에 구분자와 일치하는 글자가 있는지 탐색합니다.
 * 구분자에 있는 글자를 모두 분리하여 탐색하고, 탐색 시 발견한 가장 첫 번쨰 글자의 인덱스를 반환합니다.
 *
 * @example indexOfAny('Hello world!', 'w', 3) // 6
 * indexOfAny('Hello world!', 'w', 8) // -1
 * indexOfAny('Hello world!', 'world', 2) // 4, world를 기준으로 o 글자가 4번 인덱스에 위치함
 * @param string 탐색 대상이 되는 글입니다.
 * @param separator 구분자
 * @param from 시작 인덱스
 * @returns 시작 인덱스로부터 찾은 글자의 인덱스
 */
const indexOfAny = (string: string, separator: string, from: number) => {
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

/**
 * 문장과 최대 길이를 받아서 글을 나눕니다.
 * 이때, 중간에 \n\t가 있어 문장이 나뉘어지면 그 경우도 데이터를 분리합니다.
 * @param string 문장
 * @param limit 최대 길이
 * @returns 분리된 글
 */
export const split = (string: string, limit: number): string[] => {
  const splitted = [];
  let lastFound = -1;
  let lastSplitted = -1;
  let wordCount = 0;

  for (;;) {
    const found = indexOfAny(string, ' \n\t', lastFound + 1);
    // 발견하지 못했다면 중단함
    if (found === -1) {
      break;
    }
    // 발견했지만, 이전 글자와 이어진 경우(구분자 내에 있는 단어인 경우) 다음 글자로 넘어감.
    if (found - lastFound === 1) {
      lastFound = found;
    } else {
      // 새로운 글자를 찾은 경우, 이 경우에는 \n\t 다음의 경우
      wordCount += 1;
      // 문장을 나누는 길이를 넘어갔을 때
      if (wordCount >= limit) {
        splitted.push(string.substring(lastSplitted + 1, found));
        wordCount = 0;
        lastSplitted = found;
      }
      lastFound = found;
    }
  }

  if (lastSplitted + 1 !== string.length) {
    splitted.push(string.substring(lastSplitted + 1));
  }

  return splitted;
};

/**
 * 맞춤법 검사기 서버의 응답의 JSON을 찾습니다. 부산대 맞춤법 검사기 서버입니다.
 * @param response 응답 데이터
 * @returns 응답을 받아서 맞춤법이 틀린 곳, 정정 내용, 정정 이유를 반환합니다.
 */
export const parseJSON = (response: any) => {
  try {
    return (
      response
        // data=[ 의 형태의 글자를 모두 찾습니다.
        .match(/\tdata = \[.*;/g)
        .map((data) => JSON.parse(data.substring(8, data.length - 1)))[0][0]
        // 맞춤법 이상에 대해 매핑을 시작합니다.
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
        })
    );
  } catch (err) {
    throw new ServiceUnavailableException('맞춤법 검사에 오류가 발생했습니다.');
  }
};

/**
 * 해당 문장에서 구분자로 글을 나누며, 최대 길이가 넘어가면 배열에 글을 구분하여 저장합니다.
 * @param string 문장
 * @param separator 구분자
 * @param limit 최대 길이
 * @returns 구분자 및 최대 길이로 나뉘어진 글 배열을 반환합니다.
 */
export const byLength = (string: string, separator: string, limit: number): string[] => {
  const splitted: string[] = [];
  let lastFound = -1;
  let lastSplitted = -1;

  for (;;) {
    const found = indexOfAny(string, separator, lastFound + 1);
    if (found === -1) {
      break;
    }
    if (found - lastSplitted > limit) {
      splitted.push(string.substring(lastSplitted + 1, lastFound));
      lastSplitted = lastFound;
    }
    lastFound = found;
  }

  if (lastSplitted + 1 !== string.length) {
    if (string.length - lastSplitted - 1 <= limit) {
      splitted.push(string.substring(lastSplitted + 1));
    } else {
      if (lastSplitted !== lastFound) {
        splitted.push(string.substring(lastSplitted + 1, lastFound));
      }
      splitted.push(string.substring(lastFound + 1));
    }
  }

  return splitted;
};

/**
 * 각 태그의 속성값을 탐색합니다.
 * @param string 탐색할 문장
 * @param key 찾을 태그 속성
 * @returns 태그 속성이 위치한 곳의 값을 반환합니다.
 */
export const getAttr = (string: string, key: string) => {
  const found = string.indexOf(key);
  const firstQuote = string.indexOf('"', found + key.length);
  const secondQuote = string.indexOf('"', firstQuote + 1);
  return string.substring(firstQuote + 1, secondQuote);
};

/**
 * 다음 맞춤법 검사기에서 JSON을 찾아 반환합니다.
 * @param response
 * @returns 맞춤법 오류 종류, 맞춤법 오류, 정정 내용, 맞춤법이 틀린 주변 글, 정정 이유를 객체로하는 배열을 반환합니다.
 */
export const parseJSONFromDaum = (
  response: any,
): {
  type: string;
  token: string;
  suggestions: string[];
  context: string;
  info: string;
}[] => {
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
      // info: '',
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

    // typo.info = decode(response.substr(infoBegin, infoEnd + 6 - infoBegin))
    //   .replace(/\t/g, '')
    //   .replace(/<strong class[^>]*>[^>]*>\n/gi, '')
    //   .replace(/<br[^>]*>/gi, '\n')
    //   .replace(/<[^>]*>/g, '')
    //   .replace(/\n\n\n\n\n/g, '\n(예)\n')
    //   .replace(/\n\n*$/g, '')
    //   .replace(/^[ \n][ \n]*/g, '');

    // if (typo.info === '도움말이 없습니다.') delete typo.info;

    typos.push(typo);
  }
  return typos;
};
