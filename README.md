# bingo-p2p
This is a completely serverless mobile game of bingo utilizing libp2p protocols for communication.
The idea is to not use any server or network node in order to achieve connectivity between players who are part of a game. 
Initially, the plan is to use https://github.com/waku-org/waku-react-native to achieve p2p communication between parties. 
But ultimately, it will be moved to use libp2p directly and have truly p2p communication without any intermediary node. 

Initially this is being built as a mobile app, but same code/logic can be used to extend web at a later stage

The high level idea is as below:
1. There shall be a game admin who would create a game. 
2. Participants will join the game based on gameID shared by admin. (Currently it can be shared via 3rd party messaging like whatsapp etc)
3. Number generation shall be running on admin device and broadcasted to all game participants. 
4. Ticket generation for a game will be done at participant device and details communicated to all parties or just admin(not sure at this point)
5. Each participant would play the game and as and when someone wins something (like a row, column or whole board itself), they indicate it via some button press. This inturn would be communicated to all players to indicate the win.

