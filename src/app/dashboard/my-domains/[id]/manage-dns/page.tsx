"use client"

import React, { useEffect, useState } from 'react'
import types from './types'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input';
import { useMyDomain } from '@/services/domains/my-domains-provider'
import useFetch from '@/services/api/use-fetch'
import { API_URL } from '@/services/api/config'
import { useParams } from 'next/navigation'
import wrapperFetchJsonResponse from '@/services/api/wrapper-fetch-json-response'

export default function DnsRecords() {
    const fetch = useFetch();

    const { domain } = useMyDomain();
    const { id } = useParams();

    const [isEditing, setEditing] = useState<number>(-1);
    const [chosenType, setChosenType] = useState('A');
    const [data, setData] = useState([] as any);

    const selectedType = types[chosenType as keyof typeof types];

    const [newRecord, setNewRecord] = useState({});
    const [editingRecord, setEditingRecord] = useState({});

    useEffect(() => {
        if (domain)
            setData(domain.dnsRecords)
    }, [domain]);

    const handleAddRecord = async () => {
        try {
            setData((prev: any) => ([...prev, newRecord]));

            const requestUrl = new URL(`${API_URL}/v1/dns-settings/domains/${id}/records`);
    
            const res = await fetch(requestUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                
                body: JSON.stringify({...newRecord, ttl: parseInt((newRecord as any).ttl)})
            });
            
            if (res.ok) {
                console.log("Record added!", data);
            }
        } catch(err) {
            console.log(err);
        }
    };

    const handleEditRecord = (index: number) => {
        setEditingRecord(data[index]);
        setEditing(index);
    };

    const handleEditRecordSave = async (index: number) => {
        try {
            const formData = { ...editingRecord as any, type: chosenType };
    
            setData((prev: any) => {
                const updatedData = [...prev]; // Create a shallow copy of the array
                updatedData[index] = formData; // Update the specific record
                return updatedData; // Return the new array
            });
    
            const requestUrl = new URL(`${API_URL}/v1/dns-settings/domains/${id}/records/${formData.type}/${formData.name}`);
    
            const res = await fetch(requestUrl, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                
                body: JSON.stringify(formData)
            });
    
            if (res.ok) {
                console.log("Record saved!", data);
                setEditing(-1);
                window.alert("Record has been updated");
            }
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <div className="flex flex-col h-screen">
            <div className='flex flex-col lg:flex-row lg:items-center justify-between'>
                <h4 className="text-xl font-semibold">DNS Records</h4>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="secondary">Add New Record</Button>
                    </DialogTrigger>
                    <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                        <DialogHeader>
                            <DialogTitle>Add a new record</DialogTitle>

                            <div className='grid grid-cols-2 gap-2'>
                                <div className='col-span-2'>
                                    <label>Type</label>
                                    <Select onValueChange={setChosenType}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="A" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {
                                                Object.keys(types).map((type, i) =>
                                                    <SelectItem value={type} key={i}>
                                                        {type}
                                                    </SelectItem>
                                                )
                                            }
                                        </SelectContent>
                                    </Select>
                                </div>

                                {
                                    selectedType.map((item, i) => (
                                        <div key={i}>
                                            <label>{item.name}</label>
                                            <Input
                                                placeholder={item.name}
                                                type={item.type}
                                                value={newRecord[item.name.toLowerCase() as keyof typeof newRecord] ?? ''}
                                                onChange={(e) => setNewRecord(
                                                    prev => ({
                                                        ...prev,
                                                        type: chosenType,
                                                        [item.name.toLowerCase()]: e.target.value
                                                    })
                                                )}
                                            />
                                        </div>
                                    ))
                                }
                            </div>
                        </DialogHeader>

                        <div className='flex justify-end items-center gap-1'>
                            <Button variant="secondary" onClick={handleAddRecord}>Save</Button>
                            <DialogTrigger asChild>
                                <Button variant="destructive">Cancel</Button>
                            </DialogTrigger>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex-grow overflow-y-auto p-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Type</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Data</TableHead>
                            <TableHead className="text-right">TTL</TableHead>
                            <TableHead className="text-right"> </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((record: any, index: number) => (
                            <React.Fragment key={index}>
                                {/* Display Row */}
                                <TableRow>
                                    <TableCell className="font-medium">{record.type}</TableCell>
                                    <TableCell>{record.name}</TableCell>
                                    <TableCell>{record.data}</TableCell>
                                    <TableCell className="text-right">{record.ttl}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="secondary" onClick={() => handleEditRecord(index)}>Edit</Button>
                                    </TableCell>
                                </TableRow>

                                {/* Editing Row */}
                                {(isEditing === index && Object.keys(editingRecord).length) && (
                                    <TableRow>
                                        <TableCell colSpan={5}>
                                            <div className="flex justify-between items-center gap-4 p-4 border rounded">
                                                {/* Type Selector */}
                                                <div className='grid grid-cols-4 gap-2'>
                                                    <div className='col-span-4'>
                                                        <label className="block font-medium mb-2">Type</label>
                                                        <Select onValueChange={setChosenType} defaultValue={record.type}>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder={record.type} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {
                                                                    Object.keys(types).map((type, i) =>
                                                                        <SelectItem value={type} key={i}>
                                                                            {type}
                                                                        </SelectItem>
                                                                    )
                                                                }
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Additional Inputs */}
                                                    {selectedType.map((item, i) => (
                                                        <div key={i}>
                                                            <label className="block font-medium mb-2">{item.name}</label>
                                                            <Input
                                                                placeholder={item.name}
                                                                type={item.type}
                                                                value={editingRecord[item.name.toLowerCase() as keyof typeof editingRecord] ?? ''}
                                                                onChange={(e) => setEditingRecord(
                                                                    prev => ({
                                                                        ...prev,
                                                                        type: chosenType,
                                                                        [item.name.toLowerCase()]: e.target.value
                                                                    })
                                                                )}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="secondary" onClick={() => handleEditRecordSave(index)}>Save</Button>
                                                    <Button variant="destructive" onClick={() => setEditing(-1)}>Cancel</Button>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>

                </Table>
            </div>
        </div>
    )
}
