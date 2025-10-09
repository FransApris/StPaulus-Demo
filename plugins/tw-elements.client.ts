import { initTWE } from 'tw-elements';
import { Collapse, Ripple } from 'tw-elements';

export default defineNuxtPlugin(() => {
  initTWE({ Collapse, Ripple });
});