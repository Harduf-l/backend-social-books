const Group = require("../model/group");

exports.getGroupsList = async (req, res) => {
  try {
    const groupsList = await Group.find();
    res.status(200).json(groupsList);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.getSingleGroupData = async (req, res) => {
  try {
    const chosenGroup = await Group.findById(req.params.id);
    res.status(200).json(chosenGroup);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
