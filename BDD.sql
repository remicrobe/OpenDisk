-- phpMyAdmin SQL Dump
-- version 4.5.4.1
-- http://www.phpmyadmin.net
--
-- Client :  localhost
-- Généré le :  Sam 26 Août 2023 à 08:28
-- Version du serveur :  5.7.11
-- Version de PHP :  5.6.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `finaltraining`
--

-- --------------------------------------------------------

--
-- Structure de la table `directory`
--

CREATE TABLE `directory` (
  `idDirectory` int(11) NOT NULL,
  `DirectoryName` varchar(255) NOT NULL,
  `MainDirectory` tinyint(4) NOT NULL DEFAULT '0',
  `SubDirectoryID` int(11) DEFAULT NULL,
  `ownerIDIdUtilisateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `file`
--

CREATE TABLE `file` (
  `idFichier` int(11) NOT NULL,
  `nomFichier` varchar(255) NOT NULL,
  `nomFichierOriginal` varchar(255) NOT NULL,
  `directoryIdDirectory` int(11) DEFAULT NULL,
  `ownerIDIdUtilisateur` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE `utilisateur` (
  `idUtilisateur` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `uuid` text,
  `grade` enum('user','admin') NOT NULL DEFAULT 'user',
  `dateCreation` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `directory`
--
ALTER TABLE `directory`
  ADD PRIMARY KEY (`idDirectory`),
  ADD KEY `FK_8f79147d973ec57995b0d26fb14` (`ownerIDIdUtilisateur`);

--
-- Index pour la table `file`
--
ALTER TABLE `file`
  ADD PRIMARY KEY (`idFichier`),
  ADD KEY `FK_9835666019bdf9684d76d0b3306` (`directoryIdDirectory`),
  ADD KEY `FK_0f38cf0e1c4ec40a5e7fbcef382` (`ownerIDIdUtilisateur`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `directory`
--
ALTER TABLE `directory`
  MODIFY `idDirectory` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;
--
-- AUTO_INCREMENT pour la table `file`
--
ALTER TABLE `file`
  MODIFY `idFichier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT pour la table `utilisateur`
--
ALTER TABLE `utilisateur`
  MODIFY `idUtilisateur` int(11) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `directory`
--
ALTER TABLE `directory`
  ADD CONSTRAINT `FK_8f79147d973ec57995b0d26fb14` FOREIGN KEY (`ownerIDIdUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Contraintes pour la table `file`
--
ALTER TABLE `file`
  ADD CONSTRAINT `FK_0f38cf0e1c4ec40a5e7fbcef382` FOREIGN KEY (`ownerIDIdUtilisateur`) REFERENCES `utilisateur` (`idUtilisateur`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_9835666019bdf9684d76d0b3306` FOREIGN KEY (`directoryIdDirectory`) REFERENCES `directory` (`idDirectory`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
