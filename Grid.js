/**
 * Created by Filip on 2018-07-30.
 */

import {RailSegment} from "./RailSegment.js"
import {Station} from "./StationBuilder.js"
import {Water} from "./world/Water.js"
import {Building} from "./world/Building.js"
import * as constants from "./world/constants.js"

class Grid {
  constructor() {
    this._buildings = {};
	this.trees = [];
  }

  /**
   * Get the adjacent positions of a position
   * @param position
   * @return {Set} all adjacent positions (north, south, west, east)
   */
  adjacent(position) {
    return [
      {x: Math.floor(position.x), y: Math.floor(position.y) - constants.TILESIZE},
      {x: Math.floor(position.x), y: Math.floor(position.y) + constants.TILESIZE},
      {x: Math.floor(position.x) - constants.TILESIZE, y: Math.floor(position.y)},
      {x: Math.floor(position.x) + constants.TILESIZE, y: Math.floor(position.y)},
    ];
  }

  floatAdjacent(position) {
    return [
      {x: position.x, y: position.y - (constants.TILESIZE / 2)},
      {x: position.x, y: position.y + constants.TILESIZE},
      {x: position.x - constants.TILESIZE, y: position.y},
      {x: position.x + constants.TILESIZE, y: position.y},
    ];
  }

  adjacentBuildings(position) {
    return this.adjacent(position).filter(this.hasBuilding.bind(this))
		  .map(this.get.bind(this));
  }

  adjacentTrees(position){
    return this.adjacent(position).filter(this.hasTree.bind(this))
		  .map(this.get.bind(this));

  }

  isBuildingAdjacent(position) {
    return this.adjacent(position).some(this.hasBuilding.bind(this));
  }

  isOnBuilding(position){
	return this.hasBuilding({x: Math.floor(position.x), y: Math.floor(position.y)})
  }

  isRailAdjacent(position) {
    return this.adjacent(position).some(this.hasRail.bind(this));
  }

  isStationAdjacent(position) {
    return this.adjacent(position).some(this.hasStation.bind(this));
  }

  /**
   * Sets a building to occupy certain positions in the grid, starting in the top left corner.
   *
   * This can lead to one building occupying multiple positions.
   *
   * If the building does not have a height or width property, assume it only occupies one position.
   *
   * @param position The position in the upper left corner of the building.
   * @param building The building; probably some kind of Sprite.
   */
  set(position, building) {
    let width = building.width || constants.TILESIZE;
    let height = building.height || constants.TILESIZE;
    for (let dx = 0; dx < width; dx += constants.TILESIZE) {
       for (let dy = 0; dy < height; dy += constants.TILESIZE) {
         this._buildings['x' + (position.x + dx) + 'y' + (position.y + dy)] = building
       }
    }
  }

  get(position) {
    // TODO: throw or return null object if there is no building at position
    return this._buildings['x' + position.x + 'y' + position.y]
  }

  getPositionClosestTo(x, y) {
    let roundToNearestTile = x => constants.TILESIZE * Math.round(x/constants.TILESIZE);
    let roundedX = roundToNearestTile(x);
    let roundedY = roundToNearestTile(y);
    return {x: roundedX, y: roundedY};
  }

  hasBuilding(position) {
    return this.get(position) instanceof Building;
  }

  hasTree(position) {
    return this.get(position) instanceof Water;
  }

  hasRail(position) {
    return this.get(position) instanceof RailSegment;
  }

  hasStation(position) {
    return this.get(position) instanceof Station;
  }

  hasWater(position) {
    return this.get(position) instanceof Water;
  }

  countAdjacentWater(position) {
    return this.adjacent(position).filter(x => this.hasWater(x)).length
  }

  count() {
    return Object.keys(this._buildings).length;
  }

  /**
   * Starting with the selected rail, walk around and find all
   * positions that are connected
   *
   * @param position the starting position
   * @param positions collected so far (for recursion)
   * @returns an array with all connected positions
   * @private
   */
  _connectedRailPositions(position, positions=[]) {
    if (this._isPositionInArray(position, positions)) {
      return [];
    }
    if (!this.hasRail(position)) {
      return [];
    }
    positions.push(position);
    let rail = this.get(position);
    for (let delta_position of rail.connectedAdjacentPositions(position)) {
      let new_position = this._position_plus_delta(position, delta_position);
      this._connectedRailPositions(new_position, positions)
    }
    return positions
  }

  _isPositionInArray(position, array) {
    for (let new_position of array) {
      if (position.x == new_position.x && position.y == new_position.y) {
        return true;
      }
    }
    return false;
  }

  /**
   * Add a position to a delta position
   *
   * @param position a position, such as {x: 32, y: 64}
   * @param delta_position a delta in position, such as {x: 1, y: 0}. Expressed in number of tiles.
   * @private
   */
  _position_plus_delta(position, delta_position) {
    return {
      x: position.x + delta_position.x * constants.TILESIZE,
      y: position.y + delta_position.y * constants.TILESIZE
    }
  }

  /**
   * Return an array of points corresponding to the path from one rail position
   * @param position
   * @return an array [x1, y1, x2, y2, ...] that specifies the points
   */
  curve(position) {
    let array = [];
    for (let p of this._connectedRailPositions(position)) {
      array.push(p.x);
      array.push(p.y);
    }
    return array;
  }

  isRailSegment(building){
	return typeof building != 'undefined' && building.constructor.name == 'RailSegment'
  }
}

export {Grid};
