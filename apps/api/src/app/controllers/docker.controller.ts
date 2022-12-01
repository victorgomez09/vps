import { Router } from 'express';
import {
  pullImageFromCloud,
  runImageFromCloud,
} from '../services/docker.service';

const router = Router();

router.get('/pullFromCloud', pullImageFromCloud);
router.post('/runFromCloud', runImageFromCloud);
