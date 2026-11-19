import { AccountSchema } from '../../src/types/auth';

describe('AccountSchema', () => {
  it('drops a malformed avatar link instead of failing the sign-in', () => {
    const account = AccountSchema.parse({
      id: '6f1c2b8e-2d1a-4c5e-9b7f-0a1b2c3d4e5f',
      name: 'Sam Rivera',
      avatarUrl: 'not a link',
      provider: 'discord',
    });

    expect(account.avatarUrl).toBeNull();
  });
});
