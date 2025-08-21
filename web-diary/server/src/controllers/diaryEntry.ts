import { Request, Response } from 'express';
import UserType, { Activity } from '../types/user'; 
import DiaryEntry, { DiaryEntryType } from '../models/DiaryEntry';
import ApiResponseType, { response } from '../types/response';

export const createDiaryEntry = async (req: Request, res: Response) => {
  try {
    const { title, body, tags } = req.body;
    const files = req.files as Express.Multer.File[];

    const user = req.user as UserType;

    const filePaths = files?.map(file => ({
      filename: file.filename,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    }));

    const newEntry = new DiaryEntry({
      title,
      body,
      tags: tags.split(',').map((tag: string) => tag.trim()),
      files: filePaths,
      date: new Date(),
      user_id: user._id,
    });
    await newEntry.save();

    try {
      user.activities.unshift(new Activity(`Added a new Entry: ${newEntry.title}`, req.headers['user-agent']));
      await user.save();
    }
    catch(err: any) {
      console.log(err)
    }

    res.status(201).json({
      ...response,
      success: true,
      data: { message: 'Diary entry created successfully', entry: newEntry } 
    });
  } catch (err: Error | any) {
    res.status(500).json({...response, error: err.message });
  }
};

export const deleteDiaryEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = req.user as UserType;

    // Find the diary entry by ID
    const entry = await DiaryEntry.findById(id);

    if (!entry) {
      return res.status(404).json({...response, error: 'Diary entry not found' });
    }

    // Check if the logged-in user is the owner of the diary entry
    if (entry.user_id.toString() !== user._id.toString()) {
      return res.status(403).json({...response, error: 'You are not authorized to delete this entry' });
    }
 
    const deletedEntry: DiaryEntryType = entry;
    await entry.deleteOne();

    try {
      user.activities.unshift(new Activity(`Deleted an Entry: ${deletedEntry.title}`, req.headers['user-agent']));
      await user.save();
    }
    catch(err: any) {
      console.log(err)
    }

    res.status(200).json({ ...response,
      success: true,
      data: { message: 'Diary entry deleted successfully', deletedEntry }
      });
  } catch (err: Error | any) {
    res.status(500).json({...response, error: err.message });
  }
}

export const getEntries = async (req: Request, res: Response) => {
  try {
    const user = req.user as UserType;
    // if (!user || !user._id) {
    //   return res.status(401).json({...response, error: 'User not authenticated' });
    // }

    const userId = user._id;

    // Fetch all entries for the logged-in user
    const entries = await DiaryEntry.find({ user_id: userId });

    res.status(200).json({
      ...response,
      success: true,
      data: { entries } 
      });
  } catch (err: Error | any) {
    res.status(500).json({...response, error: err.message });
  }
};  

export const updateDiaryEntry = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body, tags, files } = req.body;
    const user = req.user as UserType;
    // if (!user || !user._id) {
    //   return res.status(401).json({...response, error: 'User not authenticated' });
    // }

    const updatedEntry = await DiaryEntry.findOneAndUpdate(
      { _id: id, user_id: user._id },
      { title, body, tags, files },
      { new: true, runValidators: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({...response, error: 'Diary entry not found' });
    }
    try {
      user.activities.unshift(new Activity(`Updated an Entry: ${updatedEntry.title}`, req.headers['user-agent']));
      await user.save();
    }
    catch(err: any) {
      console.log(err)
    }

    res.status(200).json({
      ...response,
      success: true,
      data: {message: 'Diary entry updated successfully', entry: updatedEntry }
    });
  } catch (err: Error | any) {
    res.status(500).json({...response, error: err.message });
  }
};