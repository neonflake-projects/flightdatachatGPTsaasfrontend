import React, { useState } from "react";
import axios from "axios";
import './App.css'
import { useSpeechSynthesis } from "react-speech-kit";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

function App() {
  const [forms, setForms] = useState([{ message: "", response: "" }]);
  const [count, setCount] = useState(1);
  const [loading, setLoading] = useState(false);
  const [mute, setMute] = useState(true); // initially muted
  const { speak } = useSpeechSynthesis();

  const handleSubmit = (e, index) => {
    e.preventDefault();
  
    setLoading(true);
  
    const message = forms[index].message;
    axios.post("https://combative-tan-bee.cyclic.app/", { message }).then((res) => {
      console.log(res);
      const newForms = [...forms];
      newForms[index].response = res.data.choices[0].text;
      setForms(newForms);
      setLoading(false);
      if (forms[index + 1] === undefined) {
        setForms([...newForms, { message: "", response: "" }]);
        setCount(count + 1);
        if (!mute) {
          speak({ text: newForms[index].response }); // speak the response
        }
      }
    });
  };
  
  const handleChange = (e, index) => {
    const newForms = [...forms];
    newForms[index].message = e.target.value;
    setForms(newForms);
  };

  const toggleMute = () => {
    setMute(!mute);
  };

  return (
    <div className="container">
      <h1>Flight details helper</h1>
      <div className="mute-icon-container" onClick={toggleMute}>
        {mute ? <FaVolumeMute /> : <FaVolumeUp />}
      </div>
      {forms.map((form, index) => (
        <form onSubmit={(e) => handleSubmit(e, index)} key={index}>
          <div className="reqresdiv">
            <div className="input-container">
              <textarea
                id={`input-${index}`}
                placeholder="Type your query here"
                value={form.message}
                onChange={(e) => handleChange(e, index)}
                disabled={form.response || loading}
              ></textarea>
            </div>

            <div className="output-container">
              {(
                form.response && (
                  <div>
                    <b>{form.response}</b>
                  </div>
                )
              )}
            </div>
          </div>

          {form.response ? (
            index === forms.length - 1 ? (
              <button onClick={() => setForms([...forms, { message: "", response: "" }])} id="add-form">
                Add Form
              </button>
            ) : null
          ) : (
            <button disabled={loading} id="submit">
              {loading ? "Loading..." : "Submit"}
            </button>
          )}
        </form>
      ))}
    </div>
  );
}

export default App;
