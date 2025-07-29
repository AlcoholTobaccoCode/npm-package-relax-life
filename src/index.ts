// import './renderer/styles/inkRipple.scss';
import './renderer/styles/inkRipple.css';
import './renderer/styles/fallback.css';

export { default as RelaxDrawer } from './renderer/components/RelaxDrawer.vue';
export { default as RelaxButton } from './renderer/components/RelaxButton.vue';
export { useRelax } from './renderer/composables/useRelax.js';
export { createInkRipple } from './renderer/utils/inkRipple.js';
export { 
  checkAntdAvailability, 
  getAntdComponent, 
  createFallbackComponent,
  fallbackStyles 
} from './renderer/utils/compatibility.js';