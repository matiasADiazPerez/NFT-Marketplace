import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'models/users.entity';
import { Client } from 'src/shared/clients/clients.service';
import { Db } from 'src/shared/db/db.service';
import { NftsService } from './nfts.service';

describe('NftsService', () => {
  let service: NftsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: NftsService,
          useFactory: () => {
            const usr = new User({
              password: 'testPass',
              userKey:
                '0x4520779d3d4cd4f27105f6220f16b44255d3ee298439850d69bb24f7dc8a0a00',
            });
            const db = new Db();
            db.users.push(usr);
            const client = new Client();
            const nftService = new NftsService(client, db);
            return nftService;
          },
        },
      ],
    }).compile();

    service = module.get<NftsService>(NftsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should echo', () => {
    const res = service.echo();
    console.log(res);
    expect(res).toBeDefined();
  });
});
