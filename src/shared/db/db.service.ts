import { Injectable } from '@nestjs/common';
import { Bid } from 'models/bids.entity';
import { SellOffer } from 'models/sellOffer.entity';
import { EntityType as ET } from 'models/entityType.interface';
import { User } from 'models/users.entity';

@Injectable()
export class Db {
  bids: Bid[];
  sellOffers: SellOffer[];
  users: User[];

  constructor() {
    this.bids = [];
    this.sellOffers = [];
    this.users = [];
  }

  private _lastIndex<T>(db: Array<T>) {
    if (db.length === 0) {
      return 0;
    }
    return db.length - 1;
  }

  private _getEntity<T extends ET>(id: number, db: T[]): T {
    if (id > this._lastIndex(db)) {
      throw new Error('Invalid id');
    }
    const entity = db[id];
    if (entity?.DeletedAt) {
      throw new Error('The sellOffer is deleted');
    }
    return entity;
  }

  getBid(id: number): Bid {
    return this._getEntity(id, this.bids);
  }
  getSellOffer(id: number): SellOffer {
    return this._getEntity(id, this.sellOffers);
  }
  getUser(id: number): User {
    return this._getEntity(id, this.users);
  }
  lastBidIndex(): number {
    return this._lastIndex(this.bids);
  }
  lastSellIndex(): number {
    return this._lastIndex(this.sellOffers);
  }
  lastUserIndex(): number {
    return this._lastIndex(this.users);
  }
}
