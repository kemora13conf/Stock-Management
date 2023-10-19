import {Router} from 'express'
import { list, outOfStock, stockLessThan20, item, create, upload, verifyInputs, verifyUpdateInputs, itemById, update, remove, deleteMultiple } from './Controller.js';
import { response, imagesHolder } from "../../utils.js"
import { signinRequired } from "../Auth/Controller.js"

const router = new Router();

router.param('carPartId', itemById);

router.get('/', list)
router.get('/out-of-stock', outOfStock)
router.get('/stock-less-than-20', stockLessThan20)
router.delete('/delete-multiple', signinRequired, deleteMultiple)

router.post('/', signinRequired, imagesHolder, upload.array('images'), verifyInputs, create)
router.get('/:carPartId', item)
router.put('/:carPartId', signinRequired, imagesHolder, upload.array('images'), verifyUpdateInputs, update)
router.delete('/:carPartId', signinRequired, remove)




export default router;