import { expect, test } from 'vitest';

// Grey value at (row, column) is (row * 3 + column * 5) % 50 + 10.
const greyData = [
  [10, 15, 20, 25, 30],
  [13, 18, 23, 28, 33],
  [16, 21, 26, 31, 36],
  [19, 24, 29, 34, 39],
  [22, 27, 32, 37, 42],
];

const ringKernel = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

const onesKernel = [
  [1, 1, 1],
  [1, 1, 1],
  [1, 1, 1],
];

test('grey image, ring kernel', () => {
  const image = testUtils.createGreyImage(greyData);

  expect(image.erode({ kernel: ringKernel })).toMatchImageData([
    [13, 10, 15, 20, 25],
    [10, 10, 15, 20, 25],
    [13, 13, 18, 23, 28],
    [16, 16, 21, 26, 31],
    [19, 19, 24, 29, 34],
  ]);

  expect(image.dilate({ kernel: ringKernel })).toMatchImageData([
    [18, 23, 28, 33, 33],
    [21, 26, 31, 36, 36],
    [24, 29, 34, 39, 39],
    [27, 32, 37, 42, 42],
    [27, 32, 37, 42, 39],
  ]);
});

test('grey image, only-ones kernel', () => {
  const image = testUtils.createGreyImage(greyData);

  expect(image.erode({ kernel: onesKernel })).toMatchImageData([
    [10, 10, 15, 20, 25],
    [10, 10, 15, 20, 25],
    [13, 13, 18, 23, 28],
    [16, 16, 21, 26, 31],
    [19, 19, 24, 29, 34],
  ]);

  expect(image.dilate({ kernel: onesKernel })).toMatchImageData([
    [18, 23, 28, 33, 33],
    [21, 26, 31, 36, 36],
    [24, 29, 34, 39, 39],
    [27, 32, 37, 42, 42],
    [27, 32, 37, 42, 42],
  ]);
});

test('mask, ring kernel', () => {
  const mask = testUtils.createMask(`
      0 0 0 0 0
      0 0 0 0 0
      0 0 1 0 0
      0 0 0 0 0
      0 0 0 0 0
    `);

  expect(mask.erode({ kernel: ringKernel })).toMatchMaskData(`
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
    `);

  expect(mask.dilate({ kernel: ringKernel })).toMatchMaskData(`
      0 0 0 0 0
      0 1 1 1 0
      0 1 0 1 0
      0 1 1 1 0
      0 0 0 0 0
    `);
});

test('mask, only-ones kernel', () => {
  const mask = testUtils.createMask(`
      0 0 0 0 0
      0 0 0 0 0
      0 0 1 0 0
      0 0 0 0 0
      0 0 0 0 0
    `);

  expect(mask.erode({ kernel: onesKernel })).toMatchMaskData(`
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
      0 0 0 0 0
    `);

  expect(mask.dilate({ kernel: onesKernel })).toMatchMaskData(`
      0 0 0 0 0
      0 1 1 1 0
      0 1 1 1 0
      0 1 1 1 0
      0 0 0 0 0
    `);
});

// The mean filter is not part of the shared kernel walkthrough.
// Its results must stay exactly these rows.
test('mean filter 3x3, zero outside the window', () => {
  const image = testUtils.createGreyImage(greyData);

  expect(
    image.blur({ width: 3, height: 3, borderType: 'constant', borderValue: 0 }),
  ).toMatchImageData([
    [6, 11, 14, 18, 13],
    [10, 18, 23, 28, 20],
    [12, 21, 26, 31, 22],
    [14, 24, 29, 34, 24],
    [10, 17, 20, 24, 17],
  ]);
});
