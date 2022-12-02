
import random
from typing import List
from RocketBE.Model.request_model import Song
from RocketBE.SongProcessor.processor import SongProcessor


class FlairSentimentAnalyzer(SongProcessor):

    def __init__(self) -> None:
        super().__init__()
        self.process_data()

    def process_input(self, user_mood) -> List[Song] :
        random_ten_items = random.sample(super().get_data(), 10)
        result: List[Song] = []
        for song in random_ten_items:
            result.append(
                    Song(
                        artiste=   song["artiste"],
                        title=   song["title"],
                        link = "https://twitter.com/elon",
                        thumbnail = song["thumbnail"]
                    )
            )
              
        return result   
            
        # return [
        #     Song(
        #         artiste= "Ed Sheeran",
        #         title= "A Team",
        #         link = "some url",
        #         thumbnail = "https://w7.pngwing.com/pngs/700/182/png-transparent-ed-sheeran-divide-musician-shape-of-you-others-miscellaneous-tshirt-microphone-thumbnail.png"
        #     ),
        #     Song(
        #         artiste= "Selena Gomez",
        #         title= "Rare",
        #         link = "some url",
        #         thumbnail = "https://integralatampost.s3.amazonaws.com/uploads/article/picture/20581/2020-01-16_16_092020-01-16_16_0920200118_Todo-sobre-el-nuevo-%C3%A1lbum-de-Selena-G%C3%B3mez_-Rare.jpg",
        #     )
        # ]
        

    def process_data(self) -> None:
        data: List[dict] = super().get_data()
        random_ten_items = random.sample(data, 10)
        