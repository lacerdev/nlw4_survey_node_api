import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveyUserRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUsers = await surveyUserRepository.find({
      survey_id,
      value: Not(IsNull())
    })

    const detractor = surveyUsers.filter(survey => (survey.value >= 0 && survey.value <= 6))
    const promoters = surveyUsers.filter(survey => (survey.value >= 9 && survey.value <= 10));
    const passive = surveyUsers.filter(survey => (survey.value >= 7 && survey.value <= 8));

    const totalAnswers = surveyUsers.length;

    const calculate = ((promoters.length - detractor.length) / totalAnswers * 100).toFixed(2);

    return response.json({
      detractor,
      promoters,
      passive,
      totalAnswers,
      nps: Number(calculate)
    })
  }
}

export { NpsController }