import type { ImageMetadata } from 'astro';
import { describe, expect, it } from 'vitest';
import { readSpeakers, speakerCompanies } from '../../src/lib/speakers';

const image = (src: string): ImageMetadata => ({ src, width: 400, height: 400, format: 'jpg' });
const IMAGES: ReadonlyMap<string, ImageMetadata> = new Map([
  ['sam.jpg', image('/sam.jpg')],
  ['stage.png', image('/stage.png')],
  ['wide.jpg', { ...image('/wide.jpg'), width: 400, height: 300 }],
]);

const HEADER = 'name,role,company,linkedin,website,photo,event_photo';
const sheet = (...rows: string[]): string => [HEADER, ...rows].join('\n');

describe('readSpeakers', () => {
  it('reads each row into a speaker, with photos found by file name and empty links left out', () => {
    const [speaker] = readSpeakers(
      sheet('Sam Lee,"Director, Platforms",Google,https://www.linkedin.com/in/samlee/,,sam.jpg,stage.png'),
      IMAGES,
    );
    expect(speaker).toEqual({
      name: 'Sam Lee',
      role: 'Director, Platforms',
      company: 'Google',
      linkedin: 'https://www.linkedin.com/in/samlee/',
      website: null,
      photo: IMAGES.get('sam.jpg'),
      eventPhoto: IMAGES.get('stage.png'),
    });
  });

  it('is empty when the sheet has only its header', () => {
    expect(readSpeakers(HEADER, IMAGES)).toEqual([]);
  });

  it.each([
    ['an empty name', ',Engineer,Google,,,sam.jpg,stage.png', /row 2: name is empty/],
    [
      'a LinkedIn that is not on linkedin.com',
      'Sam,Engineer,Google,https://example.com/sam,,sam.jpg,stage.png',
      /row 2: linkedin must be a linkedin\.com address/,
    ],
    [
      'a website without https',
      'Sam,Engineer,Google,,http://sam.dev,sam.jpg,stage.png',
      /row 2: website must be a full https/,
    ],
    [
      'a photo that is not in the folder',
      'Sam,Engineer,Google,,,missing.jpg,stage.png',
      /row 2: there is no photo called missing\.jpg/,
    ],
    [
      'a headshot that is not square',
      'Sam,Engineer,Google,,,wide.jpg,stage.png',
      /row 2: wide\.jpg is 400×300; crop it square first/,
    ],
  ])('stops with the row and the fix for %s', (_case, row, message) => {
    expect(() => readSpeakers(sheet(row), IMAGES)).toThrow(message);
  });

  it('counts rows like a spreadsheet, so the third speaker is row 4', () => {
    const good = 'Sam,Engineer,Google,,,sam.jpg,stage.png';
    expect(() => readSpeakers(sheet(good, good, ',Engineer,Google,,,sam.jpg,stage.png'), IMAGES)).toThrow(/row 4/);
  });

  it('names a column the sheet is missing, and one it does not know', () => {
    const noPhoto = ['name,role,company,linkedin,website,event_photo', 'Sam,Engineer,Google,,,stage.png'].join('\n');
    expect(() => readSpeakers(noPhoto, IMAGES)).toThrow(/the photo column is missing/);
    const extra = [`${HEADER},pronouns`, 'Sam,Engineer,Google,,,sam.jpg,stage.png,they'].join('\n');
    expect(() => readSpeakers(extra, IMAGES)).toThrow(/unknown column pronouns/);
  });
});

describe('speakerCompanies', () => {
  it('lists each company once, in the order they first appear', () => {
    const rows = sheet(
      'A,Engineer,RBC,,,sam.jpg,stage.png',
      'B,Engineer,Google,,,sam.jpg,stage.png',
      'C,Analyst,RBC,,,sam.jpg,stage.png',
    );
    expect(speakerCompanies(readSpeakers(rows, IMAGES))).toEqual(['RBC', 'Google']);
  });
});
