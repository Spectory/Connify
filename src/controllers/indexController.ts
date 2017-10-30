import { Router, Request, Response } from 'express';

const IndexController: Router = Router();
IndexController.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

IndexController.get('/:name', (req: Request, res: Response) => {
  let { name } = req.params;
  res.send(`Hi, ${name}`);
});

export {IndexController}