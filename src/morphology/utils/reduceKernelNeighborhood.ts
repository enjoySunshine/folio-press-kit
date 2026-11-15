import type { Image } from '../../Image.ts';
import type { Mask } from '../../Mask.ts';

/**
 * Folds the values covered by a kernel footprint around one pixel into a
 * single number. Shared by grey and mask erosion and dilation, so all four
 * operations walk the kernel the same way.
 *
 * This is the single place that decides:
 * - how kernel values are treated: only entries equal to 1 take part;
 * - how positions outside the image are treated: they are skipped.
 * @param source - Image or mask being processed.
 * @param kernel - Structuring element, accessed as kernel[row][column].
 * @param column - Column of the output pixel.
 * @param row - Row of the output pixel.
 * @param initial - Initial accumulator value (`maxValue` to erode, `0` to dilate).
 * @param reducer - Combines the accumulator with each covered value (`Math.min` to erode, `Math.max` to dilate).
 * @returns The reduced value for the output pixel.
 */
export function reduceKernelNeighborhood(
  source: Image | Mask,
  kernel: number[][],
  column: number,
  row: number,
  initial: number,
  reducer: (accumulator: number, value: number) => number,
): number {
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const radiusX = (kernelWidth - 1) / 2;
  const radiusY = (kernelHeight - 1) / 2;
  let accumulator = initial;
  for (let kernelRow = 0; kernelRow < kernelHeight; kernelRow++) {
    for (let kernelColumn = 0; kernelColumn < kernelWidth; kernelColumn++) {
      if (kernel[kernelRow][kernelColumn] !== 1) continue;
      const currentColumn = kernelColumn - radiusX + column;
      const currentRow = kernelRow - radiusY + row;
      if (
        currentColumn < 0 ||
        currentRow < 0 ||
        currentColumn >= source.width ||
        currentRow >= source.height
      ) {
        continue;
      }
      accumulator = reducer(
        accumulator,
        source.getValue(currentColumn, currentRow, 0),
      );
    }
  }
  return accumulator;
}
