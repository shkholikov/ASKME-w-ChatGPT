import React, { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";

interface IChatgpt {
	question: string;
	answer: string;
}
interface IChatgptState {
	chatgpt: IChatgpt[];
	currentQuestion: string;
	loading: boolean;
}

let openai: OpenAIApi;

const App: React.FC = () => {
	const [state, setState] = useState<IChatgptState>({
		chatgpt: [],
		currentQuestion: "",
		loading: false
	});

	useEffect(() => {
		const configuration = new Configuration({
			apiKey: process.env.REACT_APP_OPENAI_API_KEY
		});
		openai = new OpenAIApi(configuration);
	}, []);

	const askQuestion = async (): Promise<void> => {
		const currentQuestion = state.currentQuestion;
		setState({ ...state, loading: true });

		const response = await openai.createCompletion({
			model: "text-ada-001",
			prompt: currentQuestion,
			temperature: 0,
			max_tokens: 100
		});

		const chatgpt = {
			question: currentQuestion,
			answer: response?.data?.choices[0]?.text
		};

		const oldChatgpt: any[] = state.chatgpt;
		oldChatgpt.push(chatgpt);
		setState({ ...state, chatgpt: oldChatgpt, currentQuestion: "", loading: false });
	};

	const clearAnswers = (): void => {
		setState({ ...state, currentQuestion: "", chatgpt: [] });
	};

	const updateQuestion = (value: string): void => {
		setState({ ...state, currentQuestion: value });
	};

	return (
		<div>
			<h2>Welcome to ASK.ME</h2>
			<h3>ASK.ME w/ ChatGPT</h3>
			<p>Used model: Ada | Max tokens: 100</p>
			<input type="text" value={state.currentQuestion} onChange={(event) => updateQuestion(event.target.value)} />
			<button onClick={() => askQuestion()}>Ask question</button>
			<button onClick={() => clearAnswers()}>Clear answers</button>
			{state.loading ? <h3>Loading...</h3> : ""}
			<br />
			{state.chatgpt?.map((chat, key) => (
				<>
					<h3>
						Question-{key + 1}: {chat.question}
					</h3>
					<h4>Answer: {chat.answer}</h4>
				</>
			))}
		</div>
	);
};

export default App;
