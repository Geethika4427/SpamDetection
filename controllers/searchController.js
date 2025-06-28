const { Op } = require("sequelize");
const { User, Contact, SpamReport } = require("../models");

const calculateSpamLikelihood = async (phone) => {
  const totalReports = await SpamReport.count({ where: { phone } });
  return totalReports; // Can be enhanced with ratios if total user count is tracked
};

exports.searchByName = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Search query required" });

    const allContacts = await Contact.findAll({
      where: {
        name: { [Op.like]: `%${query}%` },
      },
    });

    const registeredUsers = await User.findAll({
      where: {
        name: { [Op.like]: `%${query}%` },
      },
    });

    const results = [];

    for (const user of registeredUsers) {
      const likelihood = await calculateSpamLikelihood(user.phone);
      results.push({ name: user.name, phone: user.phone, spamLikelihood: likelihood });
    }

    for (const contact of allContacts) {
      const likelihood = await calculateSpamLikelihood(contact.phone);
      if (!results.some((r) => r.phone === contact.phone)) {
        results.push({ name: contact.name, phone: contact.phone, spamLikelihood: likelihood });
      }
    }

    // Prioritize names that start with query
    const startMatches = results.filter((r) => r.name.toLowerCase().startsWith(query.toLowerCase()));
    const otherMatches = results.filter((r) => !r.name.toLowerCase().startsWith(query.toLowerCase()));

    res.json([...startMatches, ...otherMatches]);
  } catch (error) {
    res.status(500).json({ message: "Failed to search by name", error });
  }
};

// exports.searchByPhone = async (req, res) => {
//   try {
//     const query = req.query.q;
//     if (!query) return res.status(400).json({ message: "Phone number required" });

//     const user = await User.findOne({ where: { phone: query } });
//     const contacts = await Contact.findAll({ where: { phone: query } });

//     const likelihood = await calculateSpamLikelihood(query);

//     if (user) {
//       res.json([{ name: user.name, phone: user.phone, spamLikelihood: likelihood }]);
//     } else {
//       const results = contacts.map((c) => ({ name: c.name, phone: c.phone, spamLikelihood: likelihood }));
//       res.json(results);
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Failed to search by phone", error });
//   }
// };

exports.searchByPhone = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ message: "Phone number required" });

    const user = await User.findOne({ where: { phone: query } });
    const contacts = await Contact.findAll({ where: { phone: query } });

    const likelihood = await calculateSpamLikelihood(query);

    if (user) {
      // If registered user exists, return just that
      return res.json([{ name: user.name, phone: user.phone, spamLikelihood: likelihood }]);
    }

    // Deduplicate contacts by name+phone
    const uniqueContacts = [];
    const seen = new Set();

    for (const contact of contacts) {
      const key = `${contact.name}-${contact.phone}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueContacts.push({
          name: contact.name,
          phone: contact.phone,
          spamLikelihood: likelihood,
        });
      }
    }

    res.json(uniqueContacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to search by phone", error });
  }
};

// exports.getDetails = async (req, res) => {
//   try {
//     const phone = req.params.phone;
//     const user = await User.findOne({ where: { phone } });
//     const spamCount = await calculateSpamLikelihood(phone);

//     const result = {
//       name: user ? user.name : null,
//       phone,
//       spamLikelihood: spamCount,
//       email: null,
//     };

//     // If user is registered and current user is in their contact list, show email
//     if (user) {
//       const contact = await Contact.findOne({
//         where: { phone: req.user.phone, UserId: user.id },
//       });
//       if (contact) result.email = user.email;
//     }

//     res.json(result);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to get user details", error });
//   }
// };

//return the name from contacts when the number is not registered
exports.getDetails = async (req, res) => {
  try {
    const phone = req.params.phone;
    const user = await User.findOne({ where: { phone } });
    const spamCount = await calculateSpamLikelihood(phone);

    let name = null;
    let email = null;

    if (user) {
      name = user.name;

      // Check if current user is in their contact list
      const contact = await Contact.findOne({
        where: { phone: req.user.phone, UserId: user.id },
      });

      if (contact) {
        email = user.email;
      }
    } else {
      // If not a registered user, show first contact name found
      const contact = await Contact.findOne({ where: { phone } });
      if (contact) {
        name = contact.name;
      }
    }

    const result = {
      name,
      phone,
      spamLikelihood: spamCount,
      email,
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to get user details", error });
  }
};
