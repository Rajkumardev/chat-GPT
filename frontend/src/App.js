import React, { useState } from "react";
import {TextField, Grid, Box, Typography} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import Autocomplete from "@mui/material/Autocomplete";
import './App.css';
import LanguageList from "./language.json"
import axios from 'axios';

export default function App() {
  const [posts, setPosts] = useState("");
  const [searchText, setsearchtxt] = useState([]);
  const [language, setLanguage] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper fucntion to set the search text and Languages
  const handleChange= (e, name) => {
    if(name === 'searchText') {
      setsearchtxt(e.target.value);
    }
    else if(name === 'language') {
      setLanguage(e);
    }
  }

  // Submit the form data into backend
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    let languageText = language.map( (element, i) => ` ${i+ 1}. ${element.language}`).join(',');
    fetchResult(searchText, languageText);
  };

  //Hit the backend API for fetching translated content
  const fetchResult = async (searchText, languageText) => {

    await axios.post('http://localhost:8088/api/translate', {
      headers: {
        'Access-Control-Allow-Origin': true,
      },
      word: searchText,
      language: languageText
    })
    .then(function (response) {
      setPosts(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });
    setLoading(false);
  };

return (
    <div className="App">
      <header className="App-header">
      <Box
          component="form"
          sx={{
            width: "80%",
            border:"1px solid #ccc",
            padding: 2,
            margin: 2
          }}
          noValidate
          autoComplete="off"
        >
        <Typography variant="h6" component="h6">
            Chat GPT - Translate Text from English to Multiple Language
          </Typography>
        <Grid container spacing={2}>

          <Grid item xs={4}>
            <TextField
              required
              fullWidth
              label="English"
              maxRows={4}
              value={searchText}
              onChange={(e) => handleChange(e, 'searchText')}
            />
          </Grid>

          <Grid item xs={4}>
            <Autocomplete
              multiple
              required
              size="xl"
              filterSelectedOptions
              options={LanguageList.text}
              getOptionLabel={(option) => option.language}
              name="language"
              onChange={(e, newvalue) => handleChange(newvalue, 'language')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Translate to"
                  placeholder="Translate to"
                  name="language"
              />
              )}
            />
          </Grid>

          <Grid item xs={4}>
          <LoadingButton loading={loading} loadingIndicator="Translating…" color="primary" variant="contained"
              onClick={handleSubmit}>Translate</LoadingButton>
          </Grid>
        </Grid>
      </Box>
      </header>
      <Grid>
        {posts}
      </Grid>
    </div>
  );
}
