import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getTables,
  getTableById,
  getTableByNumber,
  verifyTable,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
  generateQRCode,
  downloadQRCode,
  getTableStats,
  getTableStatus,
} from './tableService';
import * as api from './api';

// Mock API functions
vi.mock('./api', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  del: vi.fn(),
}));

describe('tableService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTables', () => {
    it('should fetch all tables with no params', async () => {
      const tables = [
        { id: 'table-1', number: '1' },
        { id: 'table-2', number: '2' },
      ];

      api.get.mockResolvedValue(tables);

      const result = await getTables();

      expect(api.get).toHaveBeenCalledWith('/tables?');
      expect(result).toEqual(tables);
    });

    it('should fetch active tables only', async () => {
      const tables = [{ id: 'table-1', number: '1', active: true }];

      api.get.mockResolvedValue(tables);

      const result = await getTables({ activeOnly: true });

      expect(api.get).toHaveBeenCalledWith('/tables?activeOnly=true');
      expect(result).toEqual(tables);
    });

    it('should fetch all tables including inactive', async () => {
      const tables = [
        { id: 'table-1', number: '1', active: true },
        { id: 'table-2', number: '2', active: false },
      ];

      api.get.mockResolvedValue(tables);

      const result = await getTables({ activeOnly: false });

      expect(api.get).toHaveBeenCalledWith('/tables?activeOnly=false');
      expect(result).toEqual(tables);
    });
  });

  describe('getTableById', () => {
    it('should fetch table by ID', async () => {
      const table = { id: 'table-1', number: '1' };

      api.get.mockResolvedValue(table);

      const result = await getTableById('table-1');

      expect(api.get).toHaveBeenCalledWith('/tables/table-1');
      expect(result).toEqual(table);
    });
  });

  describe('getTableByNumber', () => {
    it('should fetch table by number', async () => {
      const table = { id: 'table-1', number: '5' };

      api.get.mockResolvedValue(table);

      const result = await getTableByNumber('5');

      expect(api.get).toHaveBeenCalledWith('/tables/number/5');
      expect(result).toEqual(table);
    });
  });

  describe('verifyTable', () => {
    it('should verify table exists and is active', async () => {
      const verification = { exists: true, active: true };

      api.get.mockResolvedValue(verification);

      const result = await verifyTable('table-1');

      expect(api.get).toHaveBeenCalledWith('/tables/table-1/verify');
      expect(result).toEqual(verification);
    });
  });

  describe('createTable', () => {
    it('should create a new table', async () => {
      const tableData = {
        number: '10',
        capacity: 4,
        location: 'Ventana',
      };

      const createdTable = { id: 'table-10', ...tableData };

      api.post.mockResolvedValue(createdTable);

      const result = await createTable(tableData);

      expect(api.post).toHaveBeenCalledWith('/tables', tableData);
      expect(result).toEqual(createdTable);
    });
  });

  describe('updateTable', () => {
    it('should update a table', async () => {
      const tableData = { capacity: 6, location: 'Terraza' };

      const updatedTable = { id: 'table-1', number: '1', ...tableData };

      api.put.mockResolvedValue(updatedTable);

      const result = await updateTable('table-1', tableData);

      expect(api.put).toHaveBeenCalledWith('/tables/table-1', tableData);
      expect(result).toEqual(updatedTable);
    });
  });

  describe('updateTableStatus', () => {
    it('should activate a table', async () => {
      const updatedTable = { id: 'table-1', active: true };

      api.patch.mockResolvedValue(updatedTable);

      const result = await updateTableStatus('table-1', true);

      expect(api.patch).toHaveBeenCalledWith('/tables/table-1/status', {
        active: true,
      });
      expect(result).toEqual(updatedTable);
    });

    it('should deactivate a table', async () => {
      const updatedTable = { id: 'table-1', active: false };

      api.patch.mockResolvedValue(updatedTable);

      const result = await updateTableStatus('table-1', false);

      expect(api.patch).toHaveBeenCalledWith('/tables/table-1/status', {
        active: false,
      });
      expect(result).toEqual(updatedTable);
    });
  });

  describe('deleteTable', () => {
    it('should delete a table', async () => {
      api.del.mockResolvedValue({});

      await deleteTable('table-1');

      expect(api.del).toHaveBeenCalledWith('/tables/table-1');
    });
  });

  describe('generateQRCode', () => {
    it('should generate QR code for table', async () => {
      const response = { qrCode: 'data:image/png;base64,abc123' };

      api.post.mockResolvedValue(response);

      const result = await generateQRCode('table-1');

      expect(api.post).toHaveBeenCalledWith('/tables/table-1/generate-qr');
      expect(result).toEqual(response);
    });
  });

  describe('downloadQRCode', () => {
    it('should download QR code with default format', async () => {
      const blob = new Blob(['qr-code'], { type: 'image/png' });

      api.get.mockResolvedValue(blob);

      const result = await downloadQRCode('table-1');

      expect(api.get).toHaveBeenCalledWith('/tables/table-1/qr/download?format=png', {
        responseType: 'blob',
      });
      expect(result).toEqual(blob);
    });

    it('should download QR code with custom format', async () => {
      const blob = new Blob(['qr-code'], { type: 'image/svg+xml' });

      api.get.mockResolvedValue(blob);

      const result = await downloadQRCode('table-1', 'svg');

      expect(api.get).toHaveBeenCalledWith('/tables/table-1/qr/download?format=svg', {
        responseType: 'blob',
      });
      expect(result).toEqual(blob);
    });
  });

  describe('getTableStats', () => {
    it('should fetch table stats with no params', async () => {
      const stats = { totalOrders: 50, totalRevenue: 200000 };

      api.get.mockResolvedValue(stats);

      const result = await getTableStats('table-1');

      expect(api.get).toHaveBeenCalledWith('/tables/table-1/stats?');
      expect(result).toEqual(stats);
    });

    it('should fetch table stats with date range', async () => {
      const stats = { totalOrders: 20, totalRevenue: 80000 };

      api.get.mockResolvedValue(stats);

      const result = await getTableStats('table-1', {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/tables/table-1/stats')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('startDate=2024-01-01')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('endDate=2024-01-31')
      );
      expect(result).toEqual(stats);
    });
  });

  describe('getTableStatus', () => {
    it('should fetch current table status', async () => {
      const status = {
        occupied: true,
        currentOrders: [{ id: 'order-1', status: 'PENDING' }],
      };

      api.get.mockResolvedValue(status);

      const result = await getTableStatus('table-1');

      expect(api.get).toHaveBeenCalledWith('/tables/table-1/status');
      expect(result).toEqual(status);
    });

    it('should fetch empty table status', async () => {
      const status = { occupied: false, currentOrders: [] };

      api.get.mockResolvedValue(status);

      const result = await getTableStatus('table-1');

      expect(result).toEqual(status);
    });
  });
});
