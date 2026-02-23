import { describe, it, expect, beforeEach } from 'vitest';
import MockAdapter from 'axios-mock-adapter';
import api from '../api';
import { playersService } from '../players';

describe('playersService', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  it('getPlayers calls /players with params', async () => {
    mock.onGet('/players').reply(200, { success: true, data: [] });
    const res = await playersService.getPlayers({ page: 2 });
    expect(res.success).toBe(true);
  });

  it('getPlayer hits /players/byId/:id', async () => {
    mock.onGet('/players/byId/7').reply(200, { success: true, data: { id: 7 } });
    const res = await playersService.getPlayer(7);
    expect(res.data.id).toBe(7);
  });
});
