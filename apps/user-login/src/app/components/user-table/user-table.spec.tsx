import { render } from '@testing-library/react';

import UserTable from './user-table';

describe('UserTable', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UserTable />);
    expect(baseElement).toBeTruthy();
  });
});
