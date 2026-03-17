import cors from "cors";
import "dotenv/config";
import express ,{ Request, Response} from "express";
import { router } from "./routes";
import { error } from "node:console";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

app.use((error: Error, _: Request, res: Response)=>{
  if(error instanceof Error){
    return res.status(400).json({
      error: error.message
    })
  }
  return res.status(500).json({
    error: "internal server error!"
  })
})

const PORT = process.env["PORT"]!;

app.listen(PORT, () => {
  console.log("servidor rodando na porta:" + PORT);
});
