import React, { useState } from "react";
import { apiEvents } from "../Auth_api.js";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

export default function TestDataGenerator() {
  const [accounts, setAccounts] = useState([]);

  const handleGenerate = async () => {
    try {
      const res = await apiEvents.post("/generate-test-data/");
      setAccounts(res.data.accounts);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Button variant="contained" onClick={handleGenerate}>
        Сгенерировать тестовые данные
      </Button>

      {accounts.length > 0 && (
        <Table sx={{ mt: 2 }}>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Password</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((acc, idx) => (
              <TableRow key={idx}>
                <TableCell>{acc.email}</TableCell>
                <TableCell>{acc.password}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
