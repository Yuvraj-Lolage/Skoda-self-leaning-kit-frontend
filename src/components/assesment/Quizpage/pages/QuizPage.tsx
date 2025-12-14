<Sidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  role={role}
  onLogout={onLogout}
/>

{quiz.length > 0 && (
  <QuizCard
    quiz={quiz}
    currentIndex={currentIndex}
    optionStyle={optionStyle}
    handleOptionClick={handleOptionClick}
    timer={timer}
    timerKey={timerKey}
    duration={TIMER_DURATION}
    handleNext={handleNext}
    handlePrevious={handlePrevious}
  />
)}

<FloatingGuide quizLoaded={quiz.length > 0} timer={timer} />
