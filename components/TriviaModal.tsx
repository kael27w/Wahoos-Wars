import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Text, TouchableOpacity, Animated, Vibration } from "react-native";

interface TriviaModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  eventData: any | null; // Expecting the event object with the trivia question
}

const TriviaModal: React.FC<TriviaModalProps> = ({ modalVisible, setModalVisible, eventData }) => {
  if (!eventData || !eventData.event_questions) return null;

  const questionData = eventData.event_questions;

  const question = questionData.question;
  const options = [...questionData.wrong_answers, questionData.correct_answer].sort(() => Math.random() - 0.5);
  const correctAnswer = questionData.correct_answer;

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (modalVisible) {
      setSelectedAnswer(null);
      setQuizFinished(false);
      setScore(0);
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [modalVisible]);

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
      setScore(1); // Since there’s only one question
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 1, duration: 100, useNativeDriver: false }),
        Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: false }),
      ]).start();
    } else {
      Vibration.vibrate(100);
    }

    setTimeout(() => {
      setQuizFinished(true);
    }, 600);
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black bg-opacity-70 px-4">
        <View className="bg-white p-6 rounded-2xl w-80 shadow-lg items-center relative overflow-hidden">
          {quizFinished ? (
            <>
              <Text className="text-xl font-bold text-gray-800 mb-4">Trivia Completed!</Text>
              <Text className="text-lg font-semibold text-blue-600">
                Your Score: {score} / 1
              </Text>
              <TouchableOpacity className="mt-6 bg-blue-500 px-6 py-3 rounded-lg w-full items-center" onPress={() => setModalVisible(false)}>
                <Text className="text-white font-bold text-lg">Done</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
              <Text className="text-lg font-bold text-gray-600 mb-2 text-center">Score: {score}</Text>
              <Text className="text-xl font-bold text-gray-900 text-center mb-6">{question}</Text>

              {options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrect = option === correctAnswer;

                return (
                  <TouchableOpacity
                    key={index}
                    className={`px-5 py-4 w-full items-center rounded-lg mt-3 ${
                      isSelected ? (isCorrect ? "bg-green-500" : "bg-red-500") : "bg-blue-500"
                    }`}
                    onPress={() => handleAnswer(option)}
                    disabled={selectedAnswer !== null}
                    style={{ width: "100%" }}
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
