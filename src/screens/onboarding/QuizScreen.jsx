import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Slider } from '../../components/ui/Slider';
import { Pills } from '../../components/ui/Pills';
import { getCategoryById } from '../../data/categories';
import { getQuestionsForCategory, UNIVERSAL_QUESTIONS } from '../../data/questions';

export function QuizScreen({ selectedCategories, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});

  // Safety check
  if (!selectedCategories || selectedCategories.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-center text-slate">Loading quiz...</p>
      </div>
    );
  }

  const primaryCategory = selectedCategories[0];
  const allQuestions = getQuestionsForCategory(primaryCategory);
  const question = allQuestions[currentQ];
  const progress = ((currentQ + 1) / allQuestions.length) * 100;
  const hasAnswer = answers[question.id] !== undefined;

  const cat = getCategoryById(primaryCategory);
  
  // Another safety check
  if (!cat) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-center text-slate">Error loading category...</p>
      </div>
    );
  }

  const isUniversalPhase = currentQ < UNIVERSAL_QUESTIONS.length;
  const isTransition = currentQ === UNIVERSAL_QUESTIONS.length;

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [question.id]: value });
  };

  const handleNext = () => {
    if (currentQ < allQuestions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      onComplete({
        answers,
        category: primaryCategory,
        selectedCategories
      });
    }
  };

  const handleBack = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  return (
    <div className="min-h-screen flex flex-col px-6 py-8 bg-cream">
      <ProgressBar progress={progress} />

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {isTransition && (
            <motion.div
              key="transition"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mb-8 rounded-2xl p-6 text-center"
              style={{ backgroundColor: `${cat.color}15` }}
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-serif text-lg" style={{ color: cat.color }}>
                Now let's learn your {cat.name} palate
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <p className="text-xs text-slate mb-2 uppercase tracking-wider">
            {currentQ + 1} / {allQuestions.length}
          </p>

          <h2 className="font-serif text-3xl mb-8">
            {question.title}
          </h2>

          {question.type === 'slider' && (
            <Slider
              leftLabel={question.leftLabel}
              rightLabel={question.rightLabel}
              value={answers[question.id]}
              onChange={handleAnswer}
            />
          )}

          {question.type === 'pills' && (
            <Pills
              options={question.options}
              value={answers[question.id]}
              onChange={handleAnswer}
            />
          )}
        </motion.div>
      </div>

      <div className="flex gap-4 pt-6">
        {currentQ > 0 && (
          <Button variant="secondary" onClick={handleBack}>
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!hasAnswer}
          className="flex-1"
        >
          {currentQ === allQuestions.length - 1 ? 'Reveal My Palate' : 'Next'}
        </Button>
      </div>
    </div>
  );
}