import * as XLSX from "xlsx";

interface ModuleProgress {
  id: string;
  name: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: "completed" | "in-progress" | "not-started";
}

interface Assessment {
  id: string;
  name: string;
  attemptNumber: number;
  marksObtained: number;
  totalMarks: number;
  status: "pass" | "fail";
  completedDate: string;
}

interface UserProgress {
  id: string;
  name: string;
  email: string;
  completedModules: number;
  totalModules: number;
  progress: number;
  latestScore: number;
  lastActive: string;
  modules: ModuleProgress[];
  assessments: Assessment[];
}

export function generateUserReport(users: UserProgress[]) {

//    USER SUMMARY SHEET
 

  const userSummary = users.map(user => ({
    UserID: user.id,
    Name: user.name,
    Email: user.email,
    OverallProgress: user.progress + "%",
    CompletedModules: user.completedModules,
    TotalModules: user.totalModules,
    LatestScore: user.latestScore + "%",
    LastActive: user.lastActive
  }));


  /* MODULE PROGRESS SHEET */

  const moduleReport = users.flatMap(user =>
    user.modules.map(module => ({
      UserID: user.id,
      UserName: user.name,
      Email: user.email,
      ModuleName: module.name,
      ModuleProgress: module.progress + "%",
      CompletedLessons: module.completedLessons,
      TotalLessons: module.totalLessons,
      Status: module.status
    }))
  );


  /* ASSESSMENT REPORT SHEETS */

  const assessmentReport = users.flatMap(user =>
    user.assessments.map(a => {

      const percentage = Math.round(
        (a.marksObtained / a.totalMarks) * 100
      );

      return {
        UserID: user.id,
        UserName: user.name,
        Email: user.email,
        AssessmentName: a.name,
        AttemptNumber: a.attemptNumber,
        MarksObtained: a.marksObtained,
        TotalMarks: a.totalMarks,
        Percentage: percentage + "%",
        Result: a.status,
        CompletedDate: new Date(a.completedDate).toLocaleDateString()
      };
    })
  );


  /*  CREATE WORKBOOK */

  const workbook = XLSX.utils.book_new();


  /* CREATE SHEETS */

  const userSheet = XLSX.utils.json_to_sheet(userSummary);
  const moduleSheet = XLSX.utils.json_to_sheet(moduleReport);
  const assessmentSheet = XLSX.utils.json_to_sheet(assessmentReport);


  /* ADD SHEETS TO WORKBOOK*/

  XLSX.utils.book_append_sheet(workbook, userSheet, "User Summary");
  XLSX.utils.book_append_sheet(workbook, moduleSheet, "Module Progress");
  XLSX.utils.book_append_sheet(workbook, assessmentSheet, "Assessments");


  /* DOWNLOAD EXCEL FILE*/

  XLSX.writeFile(workbook, "User_Training_Report.xlsx");
}

/* ================= SINGLE USER REPORT (INDIVIDUAL USER ONLY) ================= */

export function generateSingleUserReport(user: UserProgress) {

  /* USER SUMMARY SHEET - SINGLE USER ONLY */

  const userSummary = [{
    UserID: user.id,
    Name: user.name,
    Email: user.email,
    OverallProgress: user.progress + "%",
    CompletedModules: user.completedModules,
    TotalModules: user.totalModules,
    LatestScore: user.latestScore + "%",
    LastActive: user.lastActive
  }];

  /* MODULE PROGRESS SHEET - SINGLE USER ONLY */

  const moduleReport = user.modules.map(module => ({
    UserID: user.id,
    UserName: user.name,
    Email: user.email,
    ModuleName: module.name,
    ModuleProgress: module.progress + "%",
    CompletedLessons: module.completedLessons,
    TotalLessons: module.totalLessons,
    Status: module.status
  }));

  /* ASSESSMENT REPORT SHEET - SINGLE USER ONLY */

  const assessmentReport = user.assessments.map(a => {
    const percentage = Math.round(
      (a.marksObtained / a.totalMarks) * 100
    );

    return {
      UserID: user.id,
      UserName: user.name,
      Email: user.email,
      AssessmentName: a.name,
      AttemptNumber: a.attemptNumber,
      MarksObtained: a.marksObtained,
      TotalMarks: a.totalMarks,
      Percentage: percentage + "%",
      Result: a.status,
      CompletedDate: new Date(a.completedDate).toLocaleDateString()
    };
  });

  /* CREATE WORKBOOK */

  const workbook = XLSX.utils.book_new();

  /* CREATE SHEETS */

  const userSheet = XLSX.utils.json_to_sheet(userSummary);
  const moduleSheet = XLSX.utils.json_to_sheet(moduleReport);
  const assessmentSheet = XLSX.utils.json_to_sheet(assessmentReport);

  /* ADD SHEETS TO WORKBOOK */

  XLSX.utils.book_append_sheet(workbook, userSheet, "User Summary");
  XLSX.utils.book_append_sheet(workbook, moduleSheet, "Module Progress");
  XLSX.utils.book_append_sheet(workbook, assessmentSheet, "Assessments");

  /* DOWNLOAD EXCEL FILE WITH USER'S NAME */

  const fileName = `${user.name}_Training_Report.xlsx`;
  XLSX.writeFile(workbook, fileName);
}