import React, { useState } from "react";
import { jsonData } from "./json_data";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa";
import { CiLocationArrow1 } from "react-icons/ci";

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
      <FaArrowLeft />
      <FaArrowUp
        style={{
          backgroundColor: "#007AD0",
          color: "white",
        }}
      />
      <FaArrowDown />
      <CiLocationArrow1 />

      <h1>Dynamic React Form</h1>
      <form onSubmit={handleSubmit}>
        {dataSource?.api_data?.questions?.map((one, index) => {
          if (one.answer_type === "Option") {
            return (
              <div key={index}>
                <label>
                  {one?.question_text}
                  <select
                    name={`question_${one.question_id}`}
                    value={formValues[`question_${one.question_id}`] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select an option</option>
                    {one.options.map((op, idx) => (
                      <option value={op.option_text} key={idx}>
                        {op.option_text}
                      </option>
                    ))}
                  </select>
                </label>
                <br />
              </div>
            );
          }

          if (one.question_type === "Driver") {
            return (
              <div key={index}>
                {/* Parent Question */}
                <h3>{one.question_text}</h3>

                {/* Options at the top level */}
                <div>
                  {one.child_questions[0]?.options.map((op, idx) => (
                    <div key={idx}>
                      <label>{op.option_text}</label>
                    </div>
                  ))}
                </div>

                {/* Child Questions with radio buttons */}
                {one.child_questions.map((child, childIdx) => (
                  <div key={childIdx} style={{ marginTop: "10px" }}>
                    <p>{child.question_text}</p>
                    {child.options.map((op, idx) => (
                      <label key={idx} style={{ marginRight: "10px" }}>
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
                      </label>
                    ))}
                  </div>
                ))}
                <br />
              </div>
            );
          }

          if (one.question_type === "Adhoc") {
            return (
              <div key={index}>
                <label>
                  {one?.question_text}
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
    </div>
  );
}
