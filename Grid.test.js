/**
 * Created by Filip on 2018-07-30.
 */

import {Grid} from "./Grid.js";
import {WERailSegment} from "./RailSegment.js"

test('Adjacent positions', () => {
  let grid = new Grid();

  expect(grid.adjacent({x:0, y:0})).toEqual([
    {x:0, y:-32},
    {x:0, y:32},
    {x:-32, y:0},
    {x:32, y:0},
  ]);
});

describe('ConnectedRailPositions', () => {
  test('Single rail segment', () => {
    let grid = new Grid();
    grid.set({x:0, y: 0}, new WERailSegment());
    let connected_segments = 1;

    expect(grid._connectedRailPositions({x: 0, y: 0}).length).toEqual(connected_segments);
  });
  test('Two adjacent rail segments', () => {
    let grid = new Grid();
    grid.set({x:0, y: 0}, new WERailSegment());
    grid.set({x:32, y: 0}, new WERailSegment());
    let connected_segments = 2;

    expect(grid._connectedRailPositions({x: 0, y: 0}).length).toEqual(connected_segments);
  });
});

describe('curve', () => {
  test('Two adjacent rail segments', () => {
    let grid = new Grid();
    grid.set({x:0, y: 0}, new WERailSegment());
    grid.set({x:32, y: 0}, new WERailSegment());

    expect(grid.curve({x: 0, y: 0})).toEqual([0, 0, 32, 0]);
  });
});
