// ParameterExplanations.js
// Contains only labels and Wikipedia search terms for dynamic fetching

export const parameterMeta = {
  modelType: {
    label: "Model Type",
    wiki: "Artificial_neural_network",
    options: {
      CNN: { label: "CNN", wiki: "Convolutional_neural_network" },
      RNN: { label: "RNN", wiki: "Recurrent_neural_network" },
      UNet: { label: "UNet", wiki: "U-Net" },
      ResNet: { label: "ResNet", wiki: "ResNet" },
      Transformer: { label: "Transformer", wiki: "Transformer_(machine_learning_model)" },
    },
  },
  lossFunction: {
    label: "Loss Function",
    wiki: "Loss_function",
    options: {
      CrossEntropy: { label: "CrossEntropy", wiki: "Cross_entropy" },
      MSE: { label: "MSE", wiki: "Mean_squared_error" },
      MAE: { label: "MAE", wiki: "Mean_absolute_error" },
      Dice: { label: "Dice", wiki: "Sørensen–Dice_coefficient" },
      BCEWithLogits: { label: "BCEWithLogits", wiki: "Binary_cross_entropy" },
    },
  },
  optimizer: {
    label: "Optimizer",
    wiki: "Optimization_(machine_learning)",
    options: {
      Adam: { label: "Adam", wiki: "Adam_(optimizer)" },
      SGD: { label: "SGD", wiki: "Stochastic_gradient_descent" },
      RMSprop: { label: "RMSprop", wiki: "RMSprop" },
      Adagrad: { label: "Adagrad", wiki: "Adagrad" },
      AdamW: { label: "AdamW", wiki: "AdamW" },
    },
  },
  learningRate: {
    label: "Learning Rate",
    wiki: "Learning_rate",
    options: {},
  },
};
