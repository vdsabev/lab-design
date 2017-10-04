import './Loading.scss';

export const Loading: FnComponent = () => ({
  view: () =>
    <div class="absolute stretch flex-row justify-content-center align-items-center">
      <div class="loading-arc width-md height-md br-50p spin-right-animation"></div>
    </div>
});
