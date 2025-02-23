import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, Vibration } from "react-native";

interface TriviaModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const TriviaModal: React.FC<TriviaModalProps> = ({ modalVisible, setModalVisible }) => {
  const questions = [
    { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: "Paris" },
    { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correct: "Mars" },
    { question: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "J.K. Rowling", "Ernest Hemingway", "Mark Twain"], correct: "Harper Lee" },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current; // For fading in new questions
  const flashAnim = useRef(new Animated.Value(0)).current; // For flashing background on correct/wrong answer
  const progressAnim = useRef(new Animated.Value(0)).current; // Progress bar animation

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    Animated.timing(progressAnim, { toValue: (currentQuestionIndex + 1) / questions.length, duration: 300, useNativeDriver: false }).start();
  }, [currentQuestionIndex]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestionIndex].correct;

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();
    } else {
      Vibration.vibrate(100); // Haptic feedback for incorrect answer
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setQuizFinished(true);
      }
      setSelectedAnswer(null);
      fadeAnim.setValue(0);
    }, 600);
  };

  const resetQuiz = () => {
    setModalVisible(false);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70 px-4">
        <View className="bg-white p-6 rounded-2xl w-80 shadow-lg items-center relative overflow-hidden">
          {/* Progress Bar */}
          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <Animated.View style={{ width: progressAnim.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] }), height: "100%", backgroundColor: "#3B82F6" }} />
          </View>

          {quizFinished ? (
            <>
              <Text className="text-xl font-bold text-gray-800 mb-4">Trivia Completed!</Text>
              <Text className="text-lg font-semibold text-blue-600">
                Your Score: {score} / {questions.length}
              </Text>
              <TouchableOpacity className="mt-6 bg-blue-500 px-6 py-3 rounded-lg w-full items-center" onPress={resetQuiz}>
                <Text className="text-white font-bold text-lg">Done</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
              <Text className="text-lg font-bold text-gray-600 mb-2 text-center">Score: {score}</Text>
              <Text className="text-xl font-bold text-gray-900 text-center mb-6">{questions[currentQuestionIndex].question}</Text>

              {questions[currentQuestionIndex].options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === questions[currentQuestionIndex].correct;

                return (
                  <TouchableOpacity
                    key={index}
                    className={`px-5 py-4 w-full items-center rounded-lg mt-3 ${
                      isSelected ? (isCorrect ? "bg-green-500" : "bg-red-500") : "bg-blue-500"
                    }`}
                    onPress={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    style={{ width: "100%" }} // Ensures button fills width
                  >
                    <Text className="text-white font-semibold text-lg">{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </Animated.View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default TriviaModal;
