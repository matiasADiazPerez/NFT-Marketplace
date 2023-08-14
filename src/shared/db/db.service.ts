import { Injectable } from '@nestjs/common';
import { Bid } from 'models/bids.entity';
import { SellOffer } from 'models/sellOffer.entity';
import { EntityType as ET } from 'models/entityType.interface';
import { User } from 'models/users.entity';
import { DeletedEntity, EntityNotFound, InvalidId } from 'src/common/errors';

@Injectable()
/** represents the db of the application. Every `table` is an Array of the table type */
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
  /** returns safely the entity queried. It garcefully fails if the query is not possible */
  private _getEntity<T extends ET>(id: number, db: T[], entityName: string): T {
    if (id > this._lastIndex(db) || id < 0) {
      throw new InvalidId();
    }
    const entity = db[id];
    if (!entity) {
      throw new EntityNotFound(entityName, id);
    }
    if (entity.DeletedAt) {
      throw new DeletedEntity(entityName);
    }
    return entity;
  }

  getBid(id: number): Bid {
    try {
      return this._getEntity(id, this.bids, 'bid');
    } catch (err) {
      throw err;
    }
  }
  getSellOffer(id: number): SellOffer {
    return this._getEntity(id, this.sellOffers, 'sellOffer');
  }
  getUser(id: number): User {
    return this._getEntity(id, this.users, 'user');
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
