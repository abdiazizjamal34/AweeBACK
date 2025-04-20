const auth = require('../middleware/auth');



router.post('/', auth, createProduct);