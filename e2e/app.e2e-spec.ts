import { LabDesignPage } from './app.po';

describe('lab-design App', function() {
  let page: LabDesignPage;

  beforeEach(() => {
    page = new LabDesignPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
