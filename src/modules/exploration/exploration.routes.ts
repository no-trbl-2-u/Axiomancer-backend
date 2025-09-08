import { Router } from 'express';
import {
  getLocationController,
  moveToLocationController,
  getAvailableAreasController,
  travelToNodeController,
  processEventChoiceController,
  processRestController
} from './exploration.controller.js';

const router = Router();

router.get('/get-location', getLocationController);
router.post('/move-to-location', moveToLocationController);
router.get('/get-available-areas', getAvailableAreasController);
router.post('/travel-to-node', travelToNodeController);
router.post('/process-event-choice', processEventChoiceController);
router.post('/process-rest', processRestController);

export default router;