import "./style.css";
import React, { useEffect, useState } from "react";
import { jsonData } from "./json_data";
import { FaArrowLeft } from "react-icons/fa6";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

export default function App() {
  const dataSource = jsonData.data[0];

  const initialFormValues = dataSource?.api_data?.questions?.reduce(
    (acc, question) => {
      if (question.question_type === "Driver") {
        acc.answers[`${question.question_id}`] = {};
        question.child_questions.forEach((child) => {
          acc.answers[`${question.question_id}`][`${child.child_question_id}`] =
            "";
        });
      } else {
        acc.answers[`${question.question_id}`] = "";
      }
      return acc;
    },
    {
      answers: {},
      question_set_no: dataSource?.api_data?.question_set_no,
      referrer: "https://webtestda.grameenphone.com/survey/info-seeker",
      survey_channel: "Website",
    }
  );

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormValues((prev) => {
      const updatedAnswers = { ...prev.answers };
      if (["74", "75", "76"].includes(name)) {
        if (!updatedAnswers["73"]) {
          updatedAnswers["73"] = {};
        }
        updatedAnswers["73"][name] = value;
      } else {
        updatedAnswers[name] = value;
      }
      return {
        ...prev,
        answers: updatedAnswers,
      };
    });
  };

  useEffect(() => {
    if (
      formValues["answers"]["73"]["74"] !== "" &&
      formValues["answers"]["73"]["75"] !== "" &&
      formValues["answers"]["73"]["76"] !== ""
    ) {
      scrollToNextQuestion(470 * 2.5);
    }
  }, [formValues]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const scrollToNextQuestion = (data) => {
    window.scrollTo({
      top: data,
      behavior: "smooth",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted Values:", formValues);
  };

  return (
    <div className="main-container">
      <header className="header">
        <FaArrowLeft />
        <img alt="logo" src="file.png" className="logo-style" />
        <div></div>
      </header>

      <section className="form-container">
        <form>
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
                            id={`${one.question_id}_option_${idx}`}
                            name={`${one.question_id}`}
                            value={op.option_id}
                            checked={
                              formValues.answers[`${one.question_id}`] ===
                              String(op.option_id)
                            }
                            onChange={handleChange}
                            className="radio-input"
                            onClick={() =>
                              scrollToNextQuestion(411 * (index + 1))
                            }
                          />
                          <label
                            htmlFor={`question_${one.question_id}_option_${idx}`}
                            className="option"
                          >
                            {op.option_text}
                          </label>
                        </div>
                      ))}
                      <div
                        className="okay-btn"
                        onClick={() => scrollToNextQuestion(411 * (index + 1))}
                      >
                        <div>OK</div>
                        {formValues.answers[`${one.question_id}`] && (
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
                                    name={`${child.child_question_id}`}
                                    value={op.option_id}
                                    checked={
                                      formValues.answers[one.question_id][
                                        `${child.child_question_id}`
                                      ] === String(op.option_id)
                                    }
                                    onChange={handleChange}
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div
                        className="okay-btn"
                        onClick={() => scrollToNextQuestion(470 * (index + 1))}
                      >
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
                  <div className="qsn-container">
                    <div className="qsn-title">{index + 1}.</div>
                    <div>
                      <div className="qsn-title">{one?.question_text}</div>
                      <p>Give additional information within 500 character</p>
                      <div className="text-area-container">
                        <textarea
                          name={`${one.question_id}`}
                          value={formValues.answers[`${one.question_id}`] || ""}
                          onChange={handleChange}
                        />
                      </div>
                      <div
                        className="okay-btn"
                        onClick={() => {
                          scrollToNextQuestion(474 * (index + 1));
                        }}
                      >
                        <div>Save</div>
                        {formValues.answers[`${one.question_id}`] && (
                          <FaCheck />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </form>
      </section>
      <section className="sub-btn-container">
        <div className="sub-btn-wrapper">
          <button type="submit" className="sub-btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </section>
      <footer>
        <div className="footer-wrapper">
          <div className="ans-progress-wrapper">
            <p>1 of {dataSource?.api_data?.questions?.length} Answered</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{
                  width: `${
                    1 * (100 / dataSource?.api_data?.questions?.length)
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div className="icon-wrapper">
            <div className="icon-container" onClick={scrollToTop}>
              <IoIosArrowUp />
            </div>
            <div className="icon-container" onClick={scrollToBottom}>
              <IoIosArrowDown />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
