import React, { useState } from "react";
import { jsonData } from "./json_data";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { CiLocationArrow1 } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";

import "./style.css";

export default function App() {
  const dataSource = jsonData.data[0];

  const initialFormValues = dataSource?.api_data?.questions?.reduce(
    (acc, question) => {
      if (question.question_type === "Driver") {
        question.child_questions.forEach((child) => {
          acc[`question_${child.child_question_id}`] = "";
        });
      } else {
        acc[`question_${question.question_id}`] = "";
      }
      return acc;
    },
    {}
  );

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted Values:", formValues);
  };

  return (
    <div>
      <header className="header">
        <FaArrowLeft />
        {/* <img alt="logo" src="file.png" className="logo-style" /> */}
        <div></div>
      </header>

      <section className="form-container">
        <form onSubmit={handleSubmit}>
          {dataSource?.api_data?.questions?.map((one, index) => {
            if (one.answer_type === "Option") {
              return (
                <div key={index}>
                  <div className="qsn-container">
                    <div className="qsn-title">{index + 1}.</div>
                    <div>
                      <div className="qsn-title">{one?.question_text}</div>
                      <p>Select an option</p>
                      {one.options.map((op, idx) => (
                        <div key={idx} className="option-wrapper">
                          <input
                            type="radio"
                            id={`question_${one.question_id}_option_${idx}`}
                            name={`question_${one.question_id}`}
                            value={op.option_text}
                            checked={
                              formValues[`question_${one.question_id}`] ===
                              op.option_text
                            }
                            onChange={handleChange}
                            className="radio-input"
                          />
                          <label
                            htmlFor={`question_${one.question_id}_option_${idx}`}
                            className="option"
                          >
                            {op.option_text}
                          </label>
                        </div>
                      ))}
                      <div className="okay-btn">
                        <div>OK</div>
                        {formValues[`question_${one.question_id}`] && (
                          <FaCheck />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (one.question_type === "Driver") {
              return (
                <div key={index}>
                  <div className="qsn-container">
                    <div className="qsn-title">{index + 1}.</div>
                    <div>
                      <div className="qsn-title">{one?.question_text}</div>
                      <p>Select an option</p>
                      <table>
                        <thead>
                          <tr className="first-item"></tr>
                          {one.child_questions[0]?.options.map((op, idx) => (
                            <th key={idx}>{op.option_text}</th>
                          ))}
                        </thead>
                        <tbody>
                          {one.child_questions.map((child, childIdx) => (
                            <tr key={childIdx}>
                              <td className="first-item">
                                {child.question_text}
                              </td>
                              {child.options.map((op, idx) => (
                                <td key={idx}>
                                  <input
                                    type="radio"
                                    name={`child_question_${child.child_question_id}`}
                                    value={op.option_text}
                                    checked={
                                      formValues[
                                        `child_question_${child.child_question_id}`
                                      ] === op.option_text
                                    }
                                    onChange={handleChange}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="okay-btn">
                        <div>OK</div>
                        <FaCheck />
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
              );
            }

            if (one.question_type === "Adhoc") {
              return (
                <div key={index}>
                  <label>
                    {index + 1}.{one?.question_text}
                    <textarea
                      name={`question_${one.question_id}`}
                      value={formValues[`question_${one.question_id}`] || ""}
                      onChange={handleChange}
                      placeholder="Write your message here..."
                    />
                  </label>
                  <br />
                </div>
              );
            }

            return null;
          })}

          <button type="submit">Submit</button>
        </form>
      </section>
      <FaArrowUp
        style={{
          backgroundColor: "#007AD0",
          color: "white",
        }}
      />
      <FaArrowDown />
      <CiLocationArrow1 />
    </div>
  );
}
