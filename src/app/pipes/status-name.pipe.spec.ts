import { StatusNamePipe } from './status-name.pipe';

describe('StatusNamePipe', () => {
  it('create an instance', () => {
    const pipe = new StatusNamePipe();
    expect(pipe).toBeTruthy();
  });
});
