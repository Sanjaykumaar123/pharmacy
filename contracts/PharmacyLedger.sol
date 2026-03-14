// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title PharmacyLedger
 * @dev This contract acts as an immutable ledger for pharmaceutical supply chains.
 * It allows administrators to anchor medicine batch data onto the blockchain 
 * for public verification and provenance tracking.
 */
contract PharmacyLedger {
    
    struct Medicine {
        string name;
        string batch;
        string manufacturer;
        uint256 price;
        uint256 stock;
        uint256 manuDate;
        uint256 expiryDate;
        bool exists;
    }

    // Mapping from Batch ID to Medicine record
    mapping(string => Medicine) private medicines;
    
    // Array to keep track of all registered batches
    string[] public batchList;

    // Events for real-time monitoring
    event MedicineAdded(string indexed batch, string name, string manufacturer);
    event StockUpdated(string indexed batch, uint256 newStock);

    /**
     * @dev Add a new medicine batch to the ledger.
     * Only authorized network participants should call this in a production environment.
     */
    function addMedicine(
        string memory _name,
        string memory _batch,
        string memory _manufacturer,
        uint256 _price,
        uint256 _stock,
        uint256 _manuDate,
        uint256 _expiryDate
    ) public {
        require(!medicines[_batch].exists, "CRYPTOGRAPHIC_ERROR: Batch already exists on-chain");

        medicines[_batch] = Medicine({
            name: _name,
            batch: _batch,
            manufacturer: _manufacturer,
            price: _price,
            stock: _stock,
            manuDate: _manuDate,
            expiryDate: _expiryDate,
            exists: true
        });

        batchList.push(_batch);
        emit MedicineAdded(_batch, _name, _manufacturer);
    }

    /**
     * @dev Retrieve full batch details from the immutable ledger.
     */
    function getMedicine(string memory _batch) public view returns (
        string memory name,
        string memory batch,
        string memory manufacturer,
        uint256 price,
        uint256 stock,
        uint256 manuDate,
        uint256 expiryDate,
        bool exists
    ) {
        Medicine memory m = medicines[_batch];
        require(m.exists, "INVALID_QUERY: Batch ID not found in ledger");
        
        return (
            m.name, 
            m.batch, 
            m.manufacturer, 
            m.price, 
            m.stock, 
            m.manuDate, 
            m.expiryDate, 
            m.exists
        );
    }

    /**
     * @dev Update the stock level of an existing batch.
     */
    function updateStock(string memory _batch, uint256 _newStock) public {
        require(medicines[_batch].exists, "INVALID_TRANSACTION: Cannot update non-existent batch");
        
        medicines[_batch].stock = _newStock;
        emit StockUpdated(_batch, _newStock);
    }

    /**
     * @dev Get the total count of batches registered on-chain.
     */
    function getTotalBatches() public view returns (uint256) {
        return batchList.length;
    }
}
