// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title ChronoForge
 * @dev Dynamic NFT with evolving attributes and on-chain SVG generation
 * @author Chrono-Forge Team
 */
contract ChronoForge is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _tokenIdCounter;

    // Constants
    uint256 public constant MINT_PRICE = 0.001 ether;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant DAILY_ENERGY_GAIN = 10;
    uint256 public constant STREAK_BONUS_MULTIPLIER = 2;
    uint256 public constant EVOLUTION_THRESHOLD = 100;
    uint256 public constant CLEANSE_COST = 0.01 ether;

    // Enums
    enum CoreElement { None, Aqua, Terra, Pyro, Aero, Umbra }
    enum Generation { Gen1, Gen2, Gen3, Gen4, Gen5 }

    // Structs
    struct AetheriumAttributes {
        uint256 energyLevel;
        uint256 purity;
        CoreElement coreElement;
        Generation generation;
        string[] infusedTraits;
        uint256 lastEnergized;
        uint256 currentStreak;
        bool evolved;
        uint256 creationTime;
    }

    // State variables
    mapping(uint256 => AetheriumAttributes) public tokenAttributes;
    mapping(address => uint256[]) public userTokens;
    mapping(address => bool) public whitelistedPartnerTokens;
    
    // Events
    event AetheriumMinted(uint256 indexed tokenId, address indexed owner, CoreElement coreElement);
    event Energized(uint256 indexed tokenId, uint256 energyGained, uint256 newStreak);
    event TraitInfused(uint256 indexed tokenId, string trait);
    event Evolution(uint256 indexed tokenId, Generation newGeneration);
    event Forged(uint256 indexed token1, uint256 indexed token2, uint256 indexed newTokenId);
    event Cleansed(uint256 indexed tokenId, string removedTrait, uint256 newPurity);

    constructor() ERC721("Chrono-Forge Aetherium", "CFA") Ownable(msg.sender) {}

    /**
     * @dev Mint a new Aetherium Shard with random core element
     */
    function mint() external payable {
        require(msg.value >= MINT_PRICE, "Insufficient payment");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Assign random core element (excluding None)
        CoreElement randomElement = CoreElement(
            (uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, tokenId))) % 5) + 1
        );

        // Initialize token attributes
        tokenAttributes[tokenId] = AetheriumAttributes({
            energyLevel: 100,
            purity: 100,
            coreElement: randomElement,
            generation: Generation.Gen1,
            infusedTraits: new string[](0),
            lastEnergized: block.timestamp,
            currentStreak: 0,
            evolved: false,
            creationTime: block.timestamp
        });

        userTokens[msg.sender].push(tokenId);
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, generateTokenURI(tokenId));

        emit AetheriumMinted(tokenId, msg.sender, randomElement);
    }

    /**
     * @dev Daily energize action with streak bonuses
     */
    function energize(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        AetheriumAttributes storage attrs = tokenAttributes[tokenId];
        
        // Check if 24 hours have passed since last energize
        require(block.timestamp >= attrs.lastEnergized + 1 days, "Cannot energize yet");

        uint256 energyGain = DAILY_ENERGY_GAIN;
        
        // Check for streak bonus
        if (block.timestamp <= attrs.lastEnergized + 2 days) {
            attrs.currentStreak++;
            if (attrs.currentStreak >= 7) {
                energyGain *= STREAK_BONUS_MULTIPLIER;
            }
        } else {
            attrs.currentStreak = 1;
        }

        attrs.energyLevel += energyGain;
        attrs.lastEnergized = block.timestamp;
        
        // Update token URI with new attributes
        _setTokenURI(tokenId, generateTokenURI(tokenId));

        emit Energized(tokenId, energyGain, attrs.currentStreak);
    }

    /**
     * @dev Infuse a trait from a whitelisted partner token
     */
    function infuse(uint256 tokenId, address partnerToken, string memory trait) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(whitelistedPartnerTokens[partnerToken], "Partner token not whitelisted");
        
        // NOTE: In production, implement partner token burning mechanism
        // Current implementation focuses on trait infusion mechanics
        
        AetheriumAttributes storage attrs = tokenAttributes[tokenId];
        attrs.infusedTraits.push(trait);
        attrs.purity = attrs.purity > 10 ? attrs.purity - 10 : 0;
        
        _setTokenURI(tokenId, generateTokenURI(tokenId));

        emit TraitInfused(tokenId, trait);
    }

    /**
     * @dev Evolve the NFT when conditions are met
     */
    function evolve(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        AetheriumAttributes storage attrs = tokenAttributes[tokenId];
        require(!attrs.evolved, "Already evolved");
        require(attrs.energyLevel >= EVOLUTION_THRESHOLD, "Insufficient energy");
        require(attrs.purity >= 80, "Purity too low");

        attrs.evolved = true;
        if (attrs.generation < Generation.Gen5) {
            attrs.generation = Generation(uint256(attrs.generation) + 1);
        }
        attrs.energyLevel = attrs.energyLevel / 2; // Evolution consumes energy
        
        _setTokenURI(tokenId, generateTokenURI(tokenId));

        emit Evolution(tokenId, attrs.generation);
    }

    /**
     * @dev Forge two evolved NFTs into a new one
     */
    function forge(uint256 tokenId1, uint256 tokenId2) external {
        require(ownerOf(tokenId1) == msg.sender && ownerOf(tokenId2) == msg.sender, "Not token owner");
        require(tokenId1 != tokenId2, "Cannot forge same token");
        
        AetheriumAttributes storage attrs1 = tokenAttributes[tokenId1];
        AetheriumAttributes storage attrs2 = tokenAttributes[tokenId2];
        
        require(attrs1.evolved && attrs2.evolved, "Both tokens must be evolved");
        require(_tokenIdCounter < MAX_SUPPLY, "Max supply reached");

        // Store attributes before burning
        AetheriumAttributes memory storedAttrs1 = attrs1;
        AetheriumAttributes memory storedAttrs2 = attrs2;

        // Remove tokens from user's array before burning
        _removeTokenFromUser(msg.sender, tokenId1);
        _removeTokenFromUser(msg.sender, tokenId2);

        // Burn the two tokens
        _burn(tokenId1);
        _burn(tokenId2);

        // Create new token
        uint256 newTokenId = _tokenIdCounter;
        _tokenIdCounter++;

        // Combine attributes for new token using stored values
        Generation newGen = storedAttrs1.generation > storedAttrs2.generation ? storedAttrs1.generation : storedAttrs2.generation;
        if (newGen < Generation.Gen5) {
            newGen = Generation(uint256(newGen) + 1);
        }

        tokenAttributes[newTokenId] = AetheriumAttributes({
            energyLevel: (storedAttrs1.energyLevel + storedAttrs2.energyLevel) / 2,
            purity: (storedAttrs1.purity + storedAttrs2.purity) / 2,
            coreElement: storedAttrs1.coreElement, // Keep first token's element
            generation: newGen,
            infusedTraits: new string[](0), // Start fresh
            lastEnergized: block.timestamp,
            currentStreak: 0,
            evolved: false,
            creationTime: block.timestamp
        });

        userTokens[msg.sender].push(newTokenId);
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, generateTokenURI(newTokenId));

        emit Forged(tokenId1, tokenId2, newTokenId);
    }

    /**
     * @dev Cleanse unwanted traits to improve purity
     */
    function cleanse(uint256 tokenId, uint256 traitIndex) external payable {
        require(msg.value >= CLEANSE_COST, "Insufficient payment");
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        AetheriumAttributes storage attrs = tokenAttributes[tokenId];
        require(traitIndex < attrs.infusedTraits.length, "Invalid trait index");

        string memory removedTrait = attrs.infusedTraits[traitIndex];
        
        // Remove trait by swapping with last element and popping
        attrs.infusedTraits[traitIndex] = attrs.infusedTraits[attrs.infusedTraits.length - 1];
        attrs.infusedTraits.pop();
        
        attrs.purity = attrs.purity < 90 ? attrs.purity + 10 : 100;
        
        _setTokenURI(tokenId, generateTokenURI(tokenId));

        emit Cleansed(tokenId, removedTrait, attrs.purity);
    }

    /**
     * @dev Generate on-chain SVG and metadata
     */
    function generateTokenURI(uint256 tokenId) public view returns (string memory) {
        AetheriumAttributes memory attrs = tokenAttributes[tokenId];
        
        string memory svg = generateSVG(attrs);
        string memory metadata = generateMetadata(tokenId, attrs, svg);
        
        return string(abi.encodePacked(
            "data:application/json;base64,",
            Base64.encode(bytes(metadata))
        ));
    }

    /**
     * @dev Generate dynamic SVG based on attributes with generation-specific designs
     */
    function generateSVG(AetheriumAttributes memory attrs) internal pure returns (string memory) {
        string memory elementColor = getElementColor(attrs.coreElement);
        string memory generationSymbol = getGenerationSymbol(attrs.generation);
        
        if (attrs.generation == Generation.Gen1) {
            return generateGen1SVG(attrs, elementColor, generationSymbol);
        } else if (attrs.generation == Generation.Gen2) {
            return generateGen2SVG(attrs, elementColor, generationSymbol);
        } else if (attrs.generation == Generation.Gen3) {
            return generateGen3SVG(attrs, elementColor, generationSymbol);
        } else {
            return generateAdvancedGenSVG(attrs, elementColor, generationSymbol);
        }
    }

    /**
     * @dev Generate Gen 1 SVG - Crystal Shard Design
     */
    function generateGen1SVG(AetheriumAttributes memory attrs, string memory elementColor, string memory generationSymbol) internal pure returns (string memory) {
        string memory defs = string(abi.encodePacked(
            '<defs>',
            '<linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:', elementColor, ';stop-opacity:1"/>',
            '<stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.8"/>',
            '<stop offset="100%" style="stop-color:', elementColor, ';stop-opacity:0.6"/>',
            '</linearGradient>',
            '<radialGradient id="bgGrad1" cx="50%" cy="50%" r="70%">',
            '<stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1"/>',
            '<stop offset="100%" style="stop-color:#16213e;stop-opacity:1"/>',
            '</radialGradient>',
            '<filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur"/>',
            '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
            '</defs>'
        ));
        
        string memory background = '<rect width="400" height="400" fill="url(#bgGrad1)"/>';
        
        // Crystal shard shape
        uint256 energyRadius = attrs.energyLevel / 8;
        string memory crystal = string(abi.encodePacked(
            '<polygon points="200,80 160,160 120,200 160,240 200,320 240,240 280,200 240,160" ',
            'fill="url(#crystalGrad)" stroke="', elementColor, '" stroke-width="2" filter="url(#glow)"/>',
            '<polygon points="200,80 180,120 200,160 220,120" fill="rgba(255,255,255,0.3)"/>',
            '<circle cx="200" cy="200" r="', energyRadius.toString(), '" fill="', elementColor, '" opacity="0.4"/>'
        ));
        
        string memory texts = string(abi.encodePacked(
            '<text x="200" y="50" text-anchor="middle" fill="#00ffff" font-size="20" font-family="Arial,sans-serif" font-weight="bold">',
            'AETHERIUM ', generationSymbol, '</text>',
            '<text x="200" y="360" text-anchor="middle" fill="white" font-size="14">ENERGY: ', attrs.energyLevel.toString(), '</text>',
            '<text x="200" y="380" text-anchor="middle" fill="white" font-size="12">PURITY: ', attrs.purity.toString(), '% | ', getElementName(attrs.coreElement), '</text>'
        ));
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            defs, background, crystal, texts, '</svg>'
        ));
    }

    /**
     * @dev Generate Gen 2 SVG - Evolved Core Design
     */
    function generateGen2SVG(AetheriumAttributes memory attrs, string memory elementColor, string memory generationSymbol) internal pure returns (string memory) {
        string memory defs = string(abi.encodePacked(
            '<defs>',
            '<radialGradient id="coreGrad" cx="50%" cy="50%" r="50%">',
            '<stop offset="0%" style="stop-color:#ffffff;stop-opacity:1"/>',
            '<stop offset="30%" style="stop-color:', elementColor, ';stop-opacity:0.9"/>',
            '<stop offset="100%" style="stop-color:', elementColor, ';stop-opacity:0.3"/>',
            '</radialGradient>',
            '<linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">',
            '<stop offset="0%" style="stop-color:#0f0f23;stop-opacity:1"/>',
            '<stop offset="50%" style="stop-color:#1a1a2e;stop-opacity:1"/>',
            '<stop offset="100%" style="stop-color:#16213e;stop-opacity:1"/>',
            '</linearGradient>',
            '<filter id="innerGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur"/>',
            '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
            '</defs>'
        ));
        
        string memory background = '<rect width="400" height="400" fill="url(#bgGrad2)"/>';
        
        // Evolved core with orbital rings
        uint256 coreSize = 40 + (attrs.energyLevel / 5);
        uint256 ring1 = coreSize + 20;
        uint256 ring2 = coreSize + 40;
        uint256 ring3 = coreSize + 60;
        uint256 particle1X = 200 + coreSize + 25;
        uint256 particle2X = 200 - coreSize - 25;
        
        string memory core = string(abi.encodePacked(
            '<circle cx="200" cy="200" r="', coreSize.toString(), '" fill="url(#coreGrad)" filter="url(#innerGlow)"/>',
            '<circle cx="200" cy="200" r="', ring1.toString(), '" fill="none" stroke="', elementColor, '" stroke-width="1" opacity="0.6"/>',
            '<circle cx="200" cy="200" r="', ring2.toString(), '" fill="none" stroke="', elementColor, '" stroke-width="1" opacity="0.4"/>',
            '<circle cx="200" cy="200" r="', ring3.toString(), '" fill="none" stroke="', elementColor, '" stroke-width="1" opacity="0.2"/>'
        ));
        
        // Orbital particles
        string memory particles = string(abi.encodePacked(
            '<circle cx="', particle1X.toString(), '" cy="200" r="3" fill="', elementColor, '" opacity="0.8">',
            '<animateTransform attributeName="transform" type="rotate" values="0 200 200;360 200 200" dur="4s" repeatCount="indefinite"/></circle>',
            '<circle cx="', particle2X.toString(), '" cy="200" r="3" fill="', elementColor, '" opacity="0.8">',
            '<animateTransform attributeName="transform" type="rotate" values="180 200 200;540 200 200" dur="4s" repeatCount="indefinite"/></circle>'
        ));
        
        string memory texts = string(abi.encodePacked(
            '<text x="200" y="40" text-anchor="middle" fill="', elementColor, '" font-size="22" font-family="Arial,sans-serif" font-weight="bold">',
            'EVOLVED ', generationSymbol, '</text>',
            '<text x="200" y="350" text-anchor="middle" fill="white" font-size="16">CORE ENERGY: ', attrs.energyLevel.toString(), '</text>',
            '<text x="200" y="370" text-anchor="middle" fill="white" font-size="12">PURITY: ', attrs.purity.toString(), '% | ', getElementName(attrs.coreElement), ' CORE</text>'
        ));
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            defs, background, core, particles, texts, '</svg>'
        ));
    }

    /**
     * @dev Generate Gen 3 SVG - Transcendent Nexus Design
     */
    function generateGen3SVG(AetheriumAttributes memory attrs, string memory elementColor, string memory generationSymbol) internal pure returns (string memory) {
        string memory defs = string(abi.encodePacked(
            '<defs>',
            '<radialGradient id="nexusGrad" cx="50%" cy="50%" r="40%">',
            '<stop offset="0%" style="stop-color:#ffffff;stop-opacity:1"/>',
            '<stop offset="20%" style="stop-color:', elementColor, ';stop-opacity:1"/>',
            '<stop offset="60%" style="stop-color:', elementColor, ';stop-opacity:0.6"/>',
            '<stop offset="100%" style="stop-color:#000000;stop-opacity:0.8"/>',
            '</radialGradient>',
            '<radialGradient id="bgGrad3" cx="50%" cy="50%" r="80%">',
            '<stop offset="0%" style="stop-color:#000011;stop-opacity:1"/>',
            '<stop offset="70%" style="stop-color:#1a0d2e;stop-opacity:1"/>',
            '<stop offset="100%" style="stop-color:#2d1b4e;stop-opacity:1"/>',
            '</radialGradient>',
            '<filter id="powerGlow"><feGaussianBlur stdDeviation="6" result="coloredBlur"/>',
            '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
            '</defs>'
        ));
        
        string memory background = string(abi.encodePacked(
            '<rect width="400" height="400" fill="url(#bgGrad3)"/>',
            '<circle cx="200" cy="200" r="180" fill="none" stroke="', elementColor, '" stroke-width="1" opacity="0.1"/>',
            '<circle cx="200" cy="200" r="160" fill="none" stroke="', elementColor, '" stroke-width="1" opacity="0.15"/>',
            '<circle cx="200" cy="200" r="140" fill="none" stroke="', elementColor, '" stroke-width="1" opacity="0.2"/>'
        ));
        
        // Transcendent nexus core
        uint256 nexusSize = 30 + (attrs.energyLevel / 4);
        uint256 topPoint = 200 - nexusSize - 30;
        uint256 bottomPoint = 200 + nexusSize + 30;
        uint256 leftPoint = 200 - 20;
        uint256 rightPoint = 200 + 20;
        uint256 upperY = 200 - 10;
        uint256 lowerY = 200 + 10;
        
        string memory nexus = string(abi.encodePacked(
            '<circle cx="200" cy="200" r="', nexusSize.toString(), '" fill="url(#nexusGrad)" filter="url(#powerGlow)"/>',
            '<polygon points="200,', topPoint.toString(), ' ', rightPoint.toString(), ',', upperY.toString(),
            ' ', rightPoint.toString(), ',', lowerY.toString(), ' 200,', bottomPoint.toString(),
            ' ', leftPoint.toString(), ',', lowerY.toString(), ' ', leftPoint.toString(), ',', upperY.toString(),
            '" fill="', elementColor, '" opacity="0.7" filter="url(#powerGlow)"/>'
        ));
        
        // Energy conduits
        string memory conduits = string(abi.encodePacked(
            '<line x1="50" y1="200" x2="350" y2="200" stroke="', elementColor, '" stroke-width="2" opacity="0.6"/>',
            '<line x1="200" y1="50" x2="200" y2="350" stroke="', elementColor, '" stroke-width="2" opacity="0.6"/>',
            '<line x1="90" y1="90" x2="310" y2="310" stroke="', elementColor, '" stroke-width="1" opacity="0.4"/>',
            '<line x1="310" y1="90" x2="90" y2="310" stroke="', elementColor, '" stroke-width="1" opacity="0.4"/>'
        ));
        
        // Power nodes
        string memory nodes = string(abi.encodePacked(
            '<circle cx="50" cy="200" r="8" fill="', elementColor, '" opacity="0.9"/>',
            '<circle cx="350" cy="200" r="8" fill="', elementColor, '" opacity="0.9"/>',
            '<circle cx="200" cy="50" r="8" fill="', elementColor, '" opacity="0.9"/>',
            '<circle cx="200" cy="350" r="8" fill="', elementColor, '" opacity="0.9"/>'
        ));
        
        string memory texts = string(abi.encodePacked(
            '<text x="200" y="25" text-anchor="middle" fill="#ffffff" font-size="24" font-family="Arial,sans-serif" font-weight="bold" opacity="0.9">',
            'TRANSCENDENT ', generationSymbol, '</text>',
            '<text x="200" y="385" text-anchor="middle" fill="', elementColor, '" font-size="14" font-weight="bold">',
            'NEXUS POWER: ', attrs.energyLevel.toString(), ' | PURITY: ', attrs.purity.toString(), '%</text>',
            '<text x="200" y="395" text-anchor="middle" fill="white" font-size="10" opacity="0.8">',
            getElementName(attrs.coreElement), ' TRANSCENDENCE</text>'
        ));
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            defs, background, conduits, nexus, nodes, texts, '</svg>'
        ));
    }

    /**
     * @dev Generate Advanced Generation SVG (Gen 4+)
     */
    function generateAdvancedGenSVG(AetheriumAttributes memory attrs, string memory elementColor, string memory generationSymbol) internal pure returns (string memory) {
        string memory defs = string(abi.encodePacked(
            '<defs>',
            '<radialGradient id="cosmicGrad" cx="50%" cy="50%" r="50%">',
            '<stop offset="0%" style="stop-color:#ffffff;stop-opacity:1"/>',
            '<stop offset="30%" style="stop-color:', elementColor, ';stop-opacity:1"/>',
            '<stop offset="70%" style="stop-color:', elementColor, ';stop-opacity:0.4"/>',
            '<stop offset="100%" style="stop-color:#000000;stop-opacity:1"/>',
            '</radialGradient>',
            '<filter id="cosmicGlow"><feGaussianBlur stdDeviation="8" result="coloredBlur"/>',
            '<feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
            '</defs>'
        ));
        
        string memory background = '<rect width="400" height="400" fill="radial-gradient(circle, #000033 0%, #000011 100%)"/>';
        
        uint256 cosmicRadius = 20 + (attrs.energyLevel / 3);
        string memory cosmic = string(abi.encodePacked(
            '<circle cx="200" cy="200" r="', cosmicRadius.toString(), '" fill="url(#cosmicGrad)" filter="url(#cosmicGlow)"/>',
            '<text x="200" y="30" text-anchor="middle" fill="', elementColor, '" font-size="26" font-weight="bold">COSMIC ', generationSymbol, '</text>',
            '<text x="200" y="380" text-anchor="middle" fill="white" font-size="16">COSMIC POWER: ', attrs.energyLevel.toString(), '</text>'
        ));
        
        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">',
            defs, background, cosmic, '</svg>'
        ));
    }

    /**
     * @dev Generate JSON metadata
     */
    function generateMetadata(uint256 tokenId, AetheriumAttributes memory attrs, string memory svg) internal pure returns (string memory) {
        string memory traits = generateTraits(attrs);
        
        return string(abi.encodePacked(
            '{',
            '"name": "Aetherium Shard #', tokenId.toString(), '",',
            '"description": "A dynamic NFT that evolves through user interactions on the blockchain.",',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
            '"attributes": [', traits, ']',
            '}'
        ));
    }

    /**
     * @dev Generate attributes array for metadata
     */
    function generateTraits(AetheriumAttributes memory attrs) internal pure returns (string memory) {
        string memory part1 = string(abi.encodePacked(
            '{"trait_type": "Energy Level", "value": ', attrs.energyLevel.toString(), '},',
            '{"trait_type": "Purity", "value": ', attrs.purity.toString(), '},'
        ));
        
        string memory part2 = string(abi.encodePacked(
            '{"trait_type": "Core Element", "value": "', getElementName(attrs.coreElement), '"},',
            '{"trait_type": "Generation", "value": "', getGenerationName(attrs.generation), '"},'
        ));
        
        string memory part3 = string(abi.encodePacked(
            '{"trait_type": "Evolved", "value": ', attrs.evolved ? 'true' : 'false', '},',
            '{"trait_type": "Current Streak", "value": ', attrs.currentStreak.toString(), '}'
        ));
        
        return string(abi.encodePacked(part1, part2, part3));
    }

    // Helper functions
    function getElementColor(CoreElement element) internal pure returns (string memory) {
        if (element == CoreElement.Aqua) return "#0088ff";
        if (element == CoreElement.Terra) return "#8B4513";
        if (element == CoreElement.Pyro) return "#ff4400";
        if (element == CoreElement.Aero) return "#87CEEB";
        if (element == CoreElement.Umbra) return "#4B0082";
        return "#888888";
    }

    function getElementName(CoreElement element) internal pure returns (string memory) {
        if (element == CoreElement.Aqua) return "Aqua";
        if (element == CoreElement.Terra) return "Terra";
        if (element == CoreElement.Pyro) return "Pyro";
        if (element == CoreElement.Aero) return "Aero";
        if (element == CoreElement.Umbra) return "Umbra";
        return "None";
    }

    function getGenerationSymbol(Generation gen) internal pure returns (string memory) {
        if (gen == Generation.Gen1) return "I";
        if (gen == Generation.Gen2) return "II";
        if (gen == Generation.Gen3) return "III";
        if (gen == Generation.Gen4) return "IV";
        if (gen == Generation.Gen5) return "V";
        return "I";
    }

    function getGenerationName(Generation gen) internal pure returns (string memory) {
        if (gen == Generation.Gen1) return "Gen-1";
        if (gen == Generation.Gen2) return "Gen-2";
        if (gen == Generation.Gen3) return "Gen-3";
        if (gen == Generation.Gen4) return "Gen-4";
        if (gen == Generation.Gen5) return "Gen-5";
        return "Gen-1";
    }

    // Admin functions
    function whitelistPartnerToken(address token, bool isWhitelisted) external onlyOwner {
        whitelistedPartnerTokens[token] = isWhitelisted;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    function getUserTokens(address user) external view returns (uint256[] memory) {
        return userTokens[user];
    }

    // Statistics functions
    function getTotalSupply() external view returns (uint256) {
        return _tokenIdCounter;
    }

    function getBasicStats() external view returns (
        uint256 totalMinted,
        uint256 totalEvolved
    ) {
        totalMinted = _tokenIdCounter;
        uint256 evolvedCount = 0;
        
        for (uint256 i = 0; i < totalMinted; i++) {
            if (_ownerOf(i) != address(0)) {
                AetheriumAttributes storage attrs = tokenAttributes[i];
                if (attrs.evolved) {
                    evolvedCount++;
                }
            }
        }
        
        totalEvolved = evolvedCount;
    }

    /**
     * @dev Remove a token from user's token array
     */
    function _removeTokenFromUser(address user, uint256 tokenId) internal {
        uint256[] storage tokens = userTokens[user];
        for (uint256 i = 0; i < tokens.length; i++) {
            if (tokens[i] == tokenId) {
                // Replace with last element and pop
                tokens[i] = tokens[tokens.length - 1];
                tokens.pop();
                break;
            }
        }
    }

    // Helper functions to avoid struct size limits
    function getTokenBasicInfo(uint256 tokenId) external view returns (
        uint256 energyLevel,
        uint256 purity,
        CoreElement coreElement,
        Generation generation,
        bool evolved,
        uint256 creationTime
    ) {
        AetheriumAttributes memory attrs = tokenAttributes[tokenId];
        return (
            attrs.energyLevel,
            attrs.purity,
            attrs.coreElement,
            attrs.generation,
            attrs.evolved,
            attrs.creationTime
        );
    }

    function getTokenEnergyInfo(uint256 tokenId) external view returns (
        uint256 lastEnergized,
        uint256 currentStreak
    ) {
        AetheriumAttributes memory attrs = tokenAttributes[tokenId];
        return (attrs.lastEnergized, attrs.currentStreak);
    }

    function getTokenTraitsCount(uint256 tokenId) external view returns (uint256) {
        return tokenAttributes[tokenId].infusedTraits.length;
    }

    function getTokenTrait(uint256 tokenId, uint256 index) external view returns (string memory) {
        require(index < tokenAttributes[tokenId].infusedTraits.length, "Index out of bounds");
        return tokenAttributes[tokenId].infusedTraits[index];
    }

    function getTokenTraitsPaginated(uint256 tokenId, uint256 offset, uint256 limit) external view returns (string[] memory) {
        string[] storage allTraits = tokenAttributes[tokenId].infusedTraits;
        uint256 total = allTraits.length;
        
        if (offset >= total) {
            return new string[](0);
        }
        
        uint256 end = offset + limit;
        if (end > total) {
            end = total;
        }
        
        string[] memory result = new string[](end - offset);
        for (uint256 i = offset; i < end; i++) {
            result[i - offset] = allTraits[i];
        }
        
        return result;
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
